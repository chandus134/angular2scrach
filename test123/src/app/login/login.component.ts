import { Component, OnInit } from '@angular/core';
import { FirebaseUISignInSuccess } from 'firebaseui-angular';
import { AuthService } from '../auth.service';
import { Router } from "@angular/router";
import * as firebase from 'firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private auth:AuthService, private router:Router){
    // let currentuser = firebase.auth().currentUser;
    // console.log("current user", currentuser.uid)
  }


  ngOnInit() {
    
  }

  signInSuccessWithAuthResult(signInSuccessData: FirebaseUISignInSuccess) {
    console.log(signInSuccessData,"signInSuccessData")
    this.router.navigate(['/dashboard'])
    // let auth_obj = this.auth;
    // this.auth.getUser(signInSuccessData.currentUser).then(function(doc) {
    //       if (doc.exists) {
    //           console.log("Document data:", doc.data());
    //       } else {
    //           console.log("No such document!");
    //           // auth_obj.addUser(signInSuccessData.currentUser)
    //       }
    //   }).catch(function(error) {
    //       console.log("Error getting document:", error);
    //   });
  }

}
