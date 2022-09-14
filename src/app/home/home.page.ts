import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FileModalPage } from '../pages/file-modal/file-modal.page';
import { SupabaseService } from '../services/supabase.service';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  activeList = 'public';
  privateFiles = this.supabaseService.getPrivateFiles();
  publicFiles = this.supabaseService.getPublicFiles();

  constructor(private supabaseService: SupabaseService, private modalCtrl: ModalController) { }

  async addFiles() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt
    });

    const modal = await this.modalCtrl.create({
      component: FileModalPage,
      componentProps: { image }
    });

    await modal.present();
  }

  logout() {
    this.supabaseService.signOut();
  }
  
  deleteFile(item) {
    this.supabaseService.removeFileEntry(item);
  }
}
