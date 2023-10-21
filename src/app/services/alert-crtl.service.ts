import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertCrtlService {

  constructor(
    private alertCtrl: AlertController,
    private toastController: ToastController,
  ) { }

  async presentConfirm(header: any, message: any, cancelText: any, okText: any): Promise<any> {
    return new Promise(async (resolve) => {
      const alert = await this.alertCtrl.create({
        header: header,
        message: message,
        buttons: [
          {
            text: cancelText,
            role: 'cancel',
            cssClass: 'secondary',
            handler: (cancel) => {
              resolve('cancel');
            }
          }, {
            text: okText,
            handler: (ok) => {
              resolve('ok');
            }
          }
        ]
      });
      alert.present();
    });
  }

  async presentToast(message: string) {
    // position: 'top' | 'middle' | 'bottom'

    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'top'
    });

    await toast.present();
  }
  async presentErrorToast(message: string, duration: number = 1500) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: 'top',
      color: 'danger', // Using 'danger' to style the toast with a red background
      cssClass: 'error-toast'
    });

    await toast.present();
  }

}
