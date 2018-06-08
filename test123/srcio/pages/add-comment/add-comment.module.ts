import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddCommentPage } from './add-comment';

@NgModule({
  declarations: [
    AddCommentPage,
  ],
  imports: [
    IonicPageModule.forChild(AddCommentPage),
  ],
  exports: [
    AddCommentPage
  ]
})
export class AddCommentPageModule {}
