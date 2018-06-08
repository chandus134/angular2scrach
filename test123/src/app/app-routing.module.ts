import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard, LoginAuthGuard, AdminLoginAuthGuard } from './auth-guard.service';
import { SomeotherComponent } from './someother.component';
import {ProfileComponent} from './profile/profile.component';
import { DiscussionComponent } from './discussion/discussion.component';
import { NetworkComponent } from './network/network.component';
import { BuddiesComponent } from './buddies/buddies.component';
import { AdminloginComponent } from './admin/adminlogin/adminlogin.component';
import { AdmindashboardComponent } from './admin/admindashboard/admindashboard.component';
import { UsersComponent } from './admin/users/users.component';
import { SpamComponent } from './admin/spam/spam.component';
import {InboxComponent} from './inbox/inbox.component';
import {ChatComponent} from './chat/chat.component';


const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch:'full'},
  { path: 'login', component: LoginComponent,canActivate: [LoginAuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'some', component: SomeotherComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'discussion', component: DiscussionComponent, canActivate: [AuthGuard] },
  { path: 'network', component: NetworkComponent, canActivate: [AuthGuard] },
  { path: 'buddies', component: BuddiesComponent, canActivate: [AuthGuard] },
  { path: 'inbox', component: InboxComponent, canActivate: [AuthGuard] },
  { path: 'chat', component: ChatComponent, canActivate: [AuthGuard] },

  {path: 'admin', component: AdminloginComponent, canActivate:[AdminLoginAuthGuard]},
  {path: 'admindashboard', component: AdmindashboardComponent,  canActivate:[AdminLoginAuthGuard]}, 
  {path: 'users', component: UsersComponent,  canActivate:[AdminLoginAuthGuard]},
  {path: 'spamlist', component: SpamComponent,  canActivate:[AdminLoginAuthGuard]}
  
];


@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
