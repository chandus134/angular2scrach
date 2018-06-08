import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from "@angular/router";
import { Location } from '@angular/common';
import * as firebase from 'firebase';
 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {  
  route: string;
  userDetails:any = {};
  auth:any;
  navFlag:boolean;
  adminFlag: boolean = false;
  constructor(private authService: AuthService, private router:Router, private location: Location,) { 
    router.events.subscribe((val) => {
      if(location.path() == '/login' || location.path() == '/login?mode=select' || location.path() == '/admin'){
        this.navFlag = false;
      } else {
        this.navFlag = true;
        this.userDetails =  this.authService.currentUser;
      }
    });
  }
  ngOnInit() {
    console.log(this.location.path(),"=============")
    let checkAdmin = localStorage.getItem("loggedIn");
    if(!checkAdmin && this.location.path() != '/admin'){
      this.userDetails =  this.authService.currentUser;
      this.auth = this.authService.authenticated;
      console.log("this.userDetails",this.userDetails)
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.navFlag = true;
          this.router.navigate(['/dashboard'])
        } else {
          this.navFlag = false;
          this.router.navigate(['/login'])
        }
      });
    } else if(this.location.path() != '/admin'){
      this.adminFlag = true;
      this.router.navigate(['/admindashboard'])      
    }else{
      this.adminFlag = true;
    }
  }

  signOut(){
    this.authService.signOut();
  }

  adminSignOut(){
    localStorage.removeItem('loggedIn')
    this.router.navigate(['/admin'])
  }
}
