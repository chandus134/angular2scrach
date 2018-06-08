import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DiscussionDetailPage } from './discussion-detail';

@NgModule({
  declarations: [
    DiscussionDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(DiscussionDetailPage),
  ],
  exports: [
    DiscussionDetailPage
  ]
})
export class DiscussionDetailPageModule {}
