import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { SocialSharing } from '@ionic-native/social-sharing';


import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home'
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { CreateDiscussionPage } from '../pages/create-discussion/create-discussion';
import { DiscussionDetailPage } from '../pages/discussion-detail/discussion-detail';
import { NetworkListPage } from '../pages/network-list/network-list';
import { ChatPage } from '../pages/chat/chat';
import { ChatListPage } from '../pages/chat-list/chat-list'
import { BuddiesPage } from '../pages/buddies/buddies';

import { DatabaseProvider } from '../providers/database/database';
import { FirebaseuiProvider } from '../providers/firebaseui/firebaseui';
import { CommonProvider } from '../providers/common/common';
import { HttpServiceProvider } from '../providers/http-service/http-service';
import { Camera } from '@ionic-native/camera';
import { FCM } from '@ionic-native/fcm';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { PopoverComponent } from '../components/popover/popover';
import { AddCommentPage } from '../pages/add-comment/add-comment'

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomePage,
    EditProfilePage,
    CreateDiscussionPage,
    DiscussionDetailPage,
    PopoverComponent,
    NetworkListPage,
    ChatPage,
    ChatListPage,
    BuddiesPage,
    AddCommentPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    EditProfilePage,
    CreateDiscussionPage,
    DiscussionDetailPage,
    PopoverComponent,
    NetworkListPage,
    ChatPage,
    ChatListPage,
    BuddiesPage,
    AddCommentPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DatabaseProvider,
    FirebaseuiProvider,
    HttpServiceProvider,
    CommonProvider,
    Camera,
    FCM,
    PhotoViewer,
    SocialSharing
  ]
})
export class AppModule {}
