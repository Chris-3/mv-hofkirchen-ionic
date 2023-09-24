import {Injectable} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {Photo} from '@capacitor/camera';
import {Filesystem, Directory, FileInfo} from '@capacitor/filesystem';
import {isPlatform, Platform} from '@ionic/angular';
import {createClient, SupabaseClient, User} from '@supabase/supabase-js';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {FileItem, FILE_DB, MyFileInfo} from '../interfaces/file';

@Injectable({
    providedIn: 'root'
})
export class SupabaseService {
    private privateFiles: BehaviorSubject<FileItem[]> = new BehaviorSubject([]);
    private publicFiles: BehaviorSubject<FileItem[]> = new BehaviorSubject([]);
    private currentUser: BehaviorSubject<boolean | User> = new BehaviorSubject(null);

    private supabase: SupabaseClient;

    constructor(private router: Router,
                private sanitizer: DomSanitizer,
                private platform: Platform
    ) {
        this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey, {
            autoRefreshToken: true,
            persistSession: true
        });

        // Load user from storage
        this.loadUser();

        // Also listen to all auth changes
        this.supabase.auth.onAuthStateChange((event, session) => {
            console.log('AUTH CHANGED: ', event);
            console.log(session);
            if (event === 'SIGNED_IN') {
                this.currentUser.next(session.user);
                this.loadFiles();
                this.handleDbChanged();
            } else {
                this.currentUser.next(false);
            }
        });
    }

    async loadUser() {
        const user = await this.supabase.auth.user();

        if (user) {
            this.currentUser.next(user);
            this.loadFiles();
            this.handleDbChanged();
        } else {
            this.currentUser.next(false);
        }
    }

    getCurrentUser() {
        return this.currentUser.asObservable();
    }

    async signUp(credentials: { email: string; password: string }) {
        return new Promise(async (resolve, reject) => {
            const {error, user} = await this.supabase.auth.signUp(credentials);
            if (error) {
                reject(error);
            } else {
                resolve(user);
            }
        });
    }

    signIn(credentials: { email: string; password: string }) {
        return new Promise(async (resolve, reject) => {
            const {error, user} = await this.supabase.auth.signIn(credentials);
            if (error) {
                reject(error);
            } else {
                resolve(user);
            }
        });
    }

    signOut() {
        this.supabase.auth.signOut().then(_ => {
            this.publicFiles.next([]);
            this.privateFiles.next([]);

            // Clear up and end all active subscriptions!
            this.supabase.getSubscriptions().map(sub => {
                this.supabase.removeSubscription(sub);
            });

            this.router.navigateByUrl('/');
        });
    }

    async loadFiles(): Promise<void> {
        const query = await this.supabase.from(FILE_DB).select('*').order('created_at', {ascending: false});
        if (!query.data || !Array.isArray(query.data)) {
            console.error('Failed to load files. No data returned from the query.');
            return;
        }
        // Set some custom data for each item
        const data: FileItem[] = query.data.map(item => {
            item.image_url = this.getImageForFile(item);
            item.creator = item.user_id === this.supabase.auth.user().id;
            return item;
        });

        // Divide by private and public
        const privateFiles = data.filter(item => item.private);
        const publicFiles = data.filter(item => !item.private);

        this.privateFiles.next(privateFiles);
        this.publicFiles.next(publicFiles);
    }

    getPublicFiles(): Observable<FileItem[]> {
        return this.publicFiles.asObservable();
    }

    getPrivateFiles(): Observable<FileItem[]> {
        return this.privateFiles.asObservable();
    }

    // Remove a file and the DB record
    async removeFileEntry(item: FileItem): Promise<void> {
        const bucketName = item.private ? 'private' : 'public';

        await this.supabase
            .from(FILE_DB)
            .delete()
            .match({id: item.id});

        await this.supabase
            .storage
            .from(bucketName)
            .remove([item.fileName]);
    }

    // Get the Image URL for a file inside a bucket
    getImageForFile(item: FileItem) {
        const bucketName = item.private ? 'private' : 'public';

        return this.supabase.storage.from(bucketName).download(item.fileName).then(res => {
            const url = URL.createObjectURL(res.data);
            const imageUrl = this.sanitizer.bypassSecurityTrustUrl(url);
            return imageUrl;
        });
    }

    // Realtime change listener
    handleDbChanged() {
        return this.supabase
            .from(FILE_DB)
            .on('*', payload => {
                console.log('Files realtime changed: ', payload);
                if (payload.eventType === 'INSERT') {
                    // Add the new item
                    const newItem: FileItem = payload.new;
                    newItem.creator = newItem.userId === this.supabase.auth.user().id;

                    if (newItem.private && newItem.userId === this.supabase.auth.user().id) {
                        newItem.imageUrl = this.getImageForFile(newItem);
                        this.privateFiles.next([newItem, ...this.privateFiles.value]);
                    } else if (!newItem.private) {
                        newItem.imageUrl = this.getImageForFile(newItem);
                        this.publicFiles.next([newItem, ...this.publicFiles.value]);
                    }
                } else if (payload.eventType === 'DELETE') {
                    // Filter out the removed item
                    const oldItem: FileItem = payload.old;
                    if (oldItem.private && oldItem.userId === this.supabase.auth.user().id) {
                        const newValue = this.privateFiles.value.filter(item => oldItem.id !== item.id);
                        this.privateFiles.next(newValue);
                    } else if (!oldItem.private) {
                        const newValue = this.publicFiles.value.filter(item => oldItem.id !== item.id);
                        this.publicFiles.next(newValue);
                    }
                }
            }).subscribe();
    }

    async uploadFile(cameraFile: Photo, info: MyFileInfo): Promise<any> {
        let file = null;

        // Retrieve a file from the URI based on mobile/web
        if (isPlatform('hybrid')) {
            const {data: fileData} = await Filesystem.readFile({
                path: cameraFile.path as string
            });
            file = await this.dataUrlToFile(fileData);
        } else {
            if (!cameraFile.webPath) {
                throw new Error('cameraFile.webPath is not defined.');
            }
            const blob = await fetch(cameraFile.webPath).then(r => r.blob());
            file = new File([blob], 'myfile', {
                type: blob.type,
            });
        }

        const time = new Date().getTime();
        const bucketName = info.private ? 'private' : 'public';
        const fileName = `${this.supabase.auth.user().id}-${time}.webp`;

        // Upload the file to Supabase
        const {data, error} = await this.supabase
            .storage
            .from(bucketName)
            .upload(fileName, file);

        info.fileName = fileName;
        // Create a record in our DB
        return this.saveFileInfo(info);
    }

    // Create a record in our DB
    async saveFileInfo(info: MyFileInfo): Promise<any> {
        const newFile = {
            userId: this.supabase.auth.user().id,
            title: info.title,
            private: info.private,
            fileName: info.fileName
        };

        return this.supabase.from(FILE_DB).insert(newFile);
    }

    // Helper


    async addNewLineToTable(table: string, insertData: any) {
        const {data, error} = await this.supabase.from(table)
            .insert(insertData);
        if (error) {
            console.error(error);
        }
        return data || [];
    }

    async getDataFromTable(table: string) {
        const {data, error} = await this.supabase
            .from(table)
            .select('*')
        ;
        if (error) {
            console.error(error);
        }
        return data || [];
    }

    async updateDataOnTable(table: string, insertData: any, id: number) {
        const {data, error} = await this.supabase
            .from(table)
            .update(insertData)
            .eq('id', id)
            .single();

        if (error) {
            console.error(error);
        }
        return data;
    }


    async deleteDataFromTable(table: string, id: number) {
        const {data, error} = await this.supabase
            .from(table)
            .delete()
            .eq('id', id)
            .single();

        if (error) {
            console.error(error);
        }
        return data;
    }

    async getDataDetails(table: string, id: number) {
        const {data, error} = await this.supabase
            .from(table)
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error(error);
        }
        return data;
    }
    async uploadToStorage(path: string, file: File) {
        const { data, error } = await this.supabase.storage.from('avatars').upload(path, file);
        if (error) {
            throw error;
        }
        return data;
    }

    async getAvatarUrl(path: string) {
        return this.supabase.storage.from('avatars').getPublicUrl(path);
    }
    private async dataUrlToFile(dataUrl: string, fileName: string = 'myfile'): Promise<File> {
        const res = await fetch(`data:image.webp;base64,${dataUrl}`);
        const blob = await res.blob();
        return new File([blob], fileName, {type: 'image.webp'});
    }
}
