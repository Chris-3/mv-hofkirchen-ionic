import { FileModalPageModule } from '../file-modal/file-modal.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'upload',
        loadChildren: () => import('../file-modal/file-modal.module').then(m => m.FileModalPageModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes),
  // FileModalPageModule
  ],
  exports: [RouterModule]
})
export class HomePageRoutingModule { }
