import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';
import { Upload } from '../uploads/shared/upload';
import * as firebase from 'firebase';
// import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  imagePath:string = '../../assets/img/chatterplace.png';
  userDetails:any;
  name:any;
  f:NgForm;
  email:any;
  userInfoObj:object = {};
  userInfoId:string;
  constructor(private authService: AuthService) { 
  }
  ngOnInit() {
    this.userDetails =  this.authService.currentUser;
    console.log(this.userDetails,"=====userDetails")
    this.name= this.userDetails.displayName?this.userDetails.displayName:''
    this.email= this.userDetails.email?this.userDetails.email:''
    this.userInfo();
  }
  updateProfile(data){
    if(this.userInfoId){
      this.authService.updateProfile(data, this.userInfoId);
    }else{
      this.authService.addUser(data);
    }
  }

  userInfo(){
    let _DB = firebase.firestore();
    _DB.collection("users").where("email", "==", this.email).get().then((res) =>{
      console.log("reslult", res.docs[0].data())
      console.log("reslult======", res.docs[0].id)
      this.userInfoObj = res.docs[0].data();
      this.userInfoId = res.docs[0].id;
      this.imagePath = res.docs[0].data().photoURL; 
    }).catch((err)=>{

    })
  }


  selectedFiles: FileList;
  currentUpload: Upload;


  detectFiles(event) {
      this.selectedFiles = event.target.files;
      let fileReader = new FileReader();
      fileReader.onload = event1 => {
        this.imagePath = fileReader.result;
      };
      fileReader.readAsDataURL(event.target.files[0]);
  }

  uploadSingle() {
    let file = this.selectedFiles.item(0)
    this.currentUpload = new Upload(file);
    this.authService.pushUpload(this.currentUpload, this.userInfoId)
  }

  
}
