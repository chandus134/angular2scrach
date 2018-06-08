import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import * as firebase from 'firebase';

@Component({
  selector: 'app-adminlogin',
  templateUrl: './adminlogin.component.html',
  styleUrls: ['./adminlogin.component.css']
})
export class AdminloginComponent implements OnInit {
  loginDetails:any = {};
  f:NgForm;
  loginFlag:boolean = false;
  constructor( private router:Router,  private location: Location) { 
    router.events.subscribe((val) => {
      console.log(location.path().split('/'),"==================")
      if(location.path() != '/admin'){
        this.loginFlag = true;
      } else {
        this.loginFlag = false;
      }
    });
}

  ngOnInit() {
  }

  login(loginData){
    console.log(loginData,"loginData")
    let _DB = firebase.firestore();
    _DB.collection("admin").where("email", "==", loginData.email).get().then((res) =>{
      if(res.docs.length != 0){
        let adminDetails = res.docs[0].data()
        console.log("adminDetails", adminDetails)
        if(adminDetails.password == loginData.password){
          localStorage.setItem('loggedIn',adminDetails.email);
          this.router.navigate(['/admindashboard'])
        }else{
          alert('Invalid Password')
        }
      }else{
        alert('Invalid credentials')
      }
    }).catch((err)=>{
      console.log(err)
    })
  }
}
