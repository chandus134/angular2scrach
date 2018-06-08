import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ActionSheetController, Events } from 'ionic-angular';
import * as firebase from 'firebase';
import { FormBuilder, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { DatabaseProvider } from '../../providers/database/database';
import { messages, collections } from '../../config/env-example';
import { CommonProvider } from '../../providers/common/common'
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {
  userprofile: any = {}
  _CONTENT  	       : any;
  _COLL              : string = collections.users;
  typeLibrary        : string = 'PHOTOLIBRARY';
  typeCamera         : string = 'CAMERA';
  imageUploading     : any = false;
  uploadProfileImage : any;
  myPhotosRef        : any;
  myPhoto            : any;
  myPhotoURL         : any;
  displayName        : any;
  userLocation       : any;
  docId              : any;
  firestore = firebase.storage();
  profile: any = {};
  public form: any;
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    public platform: Platform,
    public actionSheetCtrl: ActionSheetController,
    private _DB: DatabaseProvider,
    private common: CommonProvider,
    private _FB: FormBuilder,
    public events: Events
  ) {
    this.userprofile = JSON.parse(localStorage.getItem("MusicianUser"));
    this.getUserProfile();
    this.myPhotosRef = firebase.storage().ref('/UserPhotos/'); 
    this.form = _FB.group({
      'displayName': ['', Validators.required],
      'userLocation': ['', Validators.required]
    }); 
  }

  private uploadPhoto(): void {
    this.myPhotosRef.child(firebase.auth().currentUser.uid).child(this.generateUUID()+'.png')
      .putString(this.myPhoto, 'base64', { contentType: 'image/png' })
      .then((savedPicture) => {
        this.myPhotoURL = savedPicture.downloadURL;
        this.userprofile.photoURL = this.myPhotoURL;
        localStorage.setItem("MusicianUser", JSON.stringify(this.userprofile));
        var user = firebase.auth().currentUser;
        user.updateProfile({
          displayName: user.displayName,
          photoURL: this.myPhotoURL
        }).then(function() {
          console.log("Updated Successfully")
          // Update successful.
        }).catch(function(error) {
          console.log("error in update")
        });        
        this.events.publish("MusicianProfile");
        this._DB.updateDocument(this._COLL, this.docId, {photoURL: this.myPhotoURL})
        .then((data) => {
        })
        .catch((error) => {            
        });

      });
  }

  private generateUUID(): any {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

  /**Image picker */
  public importPicture() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Upload Image',
      cssClass: 'upload-image',
      buttons: [
        {
          text: 'Gallery',
          icon: !this.platform.is('ios') ? 'md-image' : null,
          handler: () => {
            this.uploadImage(this.typeLibrary);
          }
        },
        {
          text: 'Camera',
          icon: !this.platform.is('ios') ? 'md-camera' : null,
          handler: () => {
            this.uploadImage(this.typeCamera);
          }
        }
      ]
    });
    actionSheet.present();
  }

  /**Upload image */
  public uploadImage(type) {
    // alert(type);
    let options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: type == this.typeCamera ? this.camera.PictureSourceType.CAMERA : this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      allowEdit: true,
      targetWidth: 800,
      targetHeight: 800
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.myPhoto = imageData;
      this.uploadProfileImage = 'data:image/jpeg;base64,' + imageData;
      /** upload profile image to server */
      if (this.uploadProfileImage) {
        this.imageUploading = true;
      }
      this.uploadPhoto();
      // this.saveDocument({});
    }, (err) => {
      // Handle error
    });
  }

  /**
   * get user profile info from users collection
   */
  getUserProfile(){
    this._DB.getProfile(firebase.auth().currentUser.uid)
    .then((res) => {
      this.docId = res.id
      this.profile = res;
      this.displayName  = res.displayName;
      this.userLocation = res.userLocation;
    }).catch((error) => {
      console.log("error", error)
    });    
  }

  /**
   * Update profile info
   */
  updateProfile(){
    this._DB.updateDocument(this._COLL,
      this.profile.id,
      {
          displayName: this.form.controls['displayName'].value,
          userLocation: this.form.controls['userLocation'].value
      })
      .then((data) => {
        this.userprofile.displayName = this.form.controls['displayName'].value;
        localStorage.setItem("MusicianUser", JSON.stringify(this.userprofile));
        var user = firebase.auth().currentUser;
        user.updateProfile({
          displayName: this.form.controls['displayName'].value,
          photoURL: user.photoURL
        }).then(function() {
        }).catch(function(error) {
        });
        
        this.events.publish("MusicianProfile");
        this.common.showToast(messages.profileUpdateSuccess);
        this.navCtrl.setRoot(HomePage);
      })
      .catch((error) => {
          this.common.showToast(messages.profileUpdateFailed);
      });
  }
}
