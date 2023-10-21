import {
    InsertUpdateMusicianDataComponent
} from './pages/musician/insert-update-musician-data/insert-update-musician-data.component';
// import { FileModalPage } from './pages/file-modal/file-modal.page';
import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {ReactiveFormsModule} from '@angular/forms';
import {
    InsertUpdateInstrumentComponent
} from './pages/instruments/insert-update-instrument/insert-update-instrument.component';

@NgModule({
    declarations: [
        AppComponent,
        InsertUpdateMusicianDataComponent,
        InsertUpdateInstrumentComponent,
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: environment.production,
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000'
        }),
        ReactiveFormsModule
    ],
    providers: [{
        provide: RouteReuseStrategy,
        useClass: IonicRouteStrategy
    }],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {
}
