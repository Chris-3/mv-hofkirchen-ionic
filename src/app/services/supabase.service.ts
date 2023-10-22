import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {createClient, SupabaseClient, User} from '@supabase/supabase-js';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {AlertCrtlService} from "./alert-crtl.service";

interface InventoryData {
    inventory_nr: number;

}

@Injectable({
    providedIn: 'root'
})
export class SupabaseService {
    private currentUser: BehaviorSubject<boolean | User> = new BehaviorSubject(null);
    private supabase: SupabaseClient;

    constructor(
        private router: Router,
        private alertService: AlertCrtlService
    ) {
        this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
        this.loadUser();
        this.supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                this.currentUser.next(session.user);
            } else {
                this.currentUser.next(false);
            }
        });
    }

    async loadUser() {
        const {data: {user}} = await this.supabase.auth.getUser();
        this.currentUser.next(user || false);
    }

    getCurrentUser() {
        return this.currentUser.asObservable();
    }

    async signUp(credentials: { email: string; password: string }) {
        const {data, error} = await this.supabase.auth.signUp(credentials);
        if (error) {
            await this.alertService.presentErrorToast(error.message);  // Display the error toast
            throw error;
        }
        return data;
    }

    async signIn(credentials: { email: string; password: string }) {
        const {data, error} = await this.supabase.auth.signInWithPassword(credentials);
        if (error) {
            await this.alertService.presentErrorToast(error.message);  // Display the error toast
            throw error;
        }
        return data;
    }

    async signOut() {
        const {error} = await this.supabase.auth.signOut();
        if (error) throw error;
        await this.router.navigateByUrl('/');
    }

    async addNewLineToTable(table: string, insertData: any) {
        const {data, error} = await this.supabase.from(table).insert(insertData);
        if (error) {
            await this.alertService.presentErrorToast(error.message);  // Display the error toast
            throw error;
        }
        return data || [];
    }

    async getDataFromTable(table: string) {
        const {data, error} = await this.supabase.from(table).select('*');
        if (error) {
            await this.alertService.presentErrorToast(error.message);  // Display the error toast
            throw error;
        }
        return data || [];
    }

    async updateDataOnTable(table: string, insertData: any, id: number) {
        const {data, error} = await this.supabase.from(table).update(insertData).eq('id', id).single();
        if (error) {
            await this.alertService.presentErrorToast(error.message);  // Display the error toast
            throw error;
        }
        return data;
    }

    async deleteDataFromTable(table: string, id: number) {
        const {data, error} = await this.supabase.from(table).delete().eq('id', id).single();
        if (error) {
            await this.alertService.presentErrorToast(error.message);  // Display the error toast
            throw error;
        }
        return data;
    }

    async getDataDetails(table: string, id: number) {
        const {data, error} = await this.supabase.from(table).select('*').eq('id', id).single();
        if (error) {
            await this.alertService.presentErrorToast(error.message);  // Display the error toast
            throw error;
        }
        return data;
    }

    async getNextFreeInventoryNumber(labelShort: string): Promise<number | null> {
        const {data, error} = await this.supabase
            .rpc('get_inventory_numbers_of_label_short', {p_label_short: labelShort})


        // console.info(data[0].inventory_nr);
        if (error) {
            console.error("Error fetching highest inventoryNr:", error);
            return null;
        }
        if (!data || data.length < 1) {
            return 1; // If no data returned, return 1 as the next available number
        }

        let missingNumber = 0;

// Traverse the sorted numbers to find the missing number
        for (let i = 1; i < data.length; i++) {
            if (data[i].inventory_nr - data[i - 1].inventory_nr > 1) {
                missingNumber = data[i - 1].inventory_nr + 1;
                break;
            }
        }

        if (!missingNumber) {
            missingNumber = data[data.length - 1].inventory_nr + 1;
        }
        return missingNumber;
        // return data && data[0] && data[0].inventoryNr ? data[0].inventoryNr : null;
    }
  async getAllInstruments(labelShort = null) {
    const params = labelShort ? { p_label_short: labelShort } : {};

    const { data, error } = await this.supabase.rpc('get_instruments', params);

    if (error) {
      console.error("Error fetching instruments:", error);
      return null;
    }

    return data;
  }

}
