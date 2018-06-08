import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NetworkListPage } from './network-list';

@NgModule({
  declarations: [
    NetworkListPage,
  ],
  imports: [
    IonicPageModule.forChild(NetworkListPage),
  ],
  exports: [
    NetworkListPage
  ]
})
export class NetworkListPageModule {}
