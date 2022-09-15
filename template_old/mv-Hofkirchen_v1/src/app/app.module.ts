import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { MusikerPage } from '../pages/musiker/musiker';
import { KalenderPage } from '../pages/kalender/kalender';
import { LoginPage } from '../pages/login/login';
import { MusikerDetailsPage } from '../pages/musiker-details/musiker-details';
import { InstrumentePage } from '../pages/instrumente/instrumente';
import { InstrumentenDetailsPage } from '../pages/instrumenten-details/instrumenten-details';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MusikerPage,
    KalenderPage,
    LoginPage,
    MusikerDetailsPage,
    InstrumentePage,
    InstrumentenDetailsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    MusikerPage,
    KalenderPage,
    LoginPage,
    MusikerDetailsPage,
    InstrumentePage,
    InstrumentenDetailsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}