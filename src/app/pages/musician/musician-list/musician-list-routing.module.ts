import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {MusicianListPage} from './musician-list.page';
import {InsertUpdateMusicianDataComponent} from '../insert-update-musician-data/insert-update-musician-data.component';

const routes: Routes = [
    {
        path: '',
        component: MusicianListPage
    }
];

@NgModule({
    // declarations: [InsertUpdateMusicianDataComponent,],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MusicianListPageRoutingModule {
}
