import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateDiscussionPage } from './create-discussion';

@NgModule({
  declarations: [
    CreateDiscussionPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateDiscussionPage),
  ],
  exports: [
    CreateDiscussionPage
  ]
})
export class CreateDiscussionPageModule {}
