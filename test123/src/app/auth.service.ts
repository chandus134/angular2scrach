import { Injectable } from '@angular/core';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from "@angular/router";
import * as firebase from 'firebase';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Upload } from './uploads/shared/upload';
import { ToastrService } from 'ngx-toastr';


@Injectable()
export class AuthService {

  authState: any = null;
  token:string;

  constructor(private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router:Router,
    private afs:AngularFirestore,
    private toastr: ToastrService) {  
    console.log("auth test")
    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth
    });
    this.afAuth.authState.subscribe(this.firebaseAuthChangeListener);

    // firebase.auth().onAuthStateChanged(function(user) {
    //   window.user = user; // user is undefined if no user signed in
    //  });
     
  }

  private firebaseAuthChangeListener(response) {
      // if needed, do a redirect in here
      if (response) {
        console.log('Logged in :)',response);
          firebase.auth().currentUser.getIdToken()
          .then(
            function(token:string){
              localStorage.setItem('token', token)
            }
          ).catch(error => console.log(error));
      } else {
        console.log('Logged out :(');
        localStorage.removeItem('token');
        // routerObj.navigate(['/login'])
      }
    }

  private basePath:string = '/uploads';
  // uploads: FirebaseListObservable<Upload[]>;

  // Returns true if user is logged in
  get authenticated(): boolean {
    return this.authState !== null;
    // this.token = localStorage.getItem('token')
    // return this.token !== null;
  }

  // Returns current user data
  get currentUser(): any {
    return this.authenticated ? this.authState : null;
  }

  // Returns
  get currentUserObservable(): any {
    return this.afAuth.authState
  }

  // Returns current user UID
  get currentUserId(): string {
    return this.authenticated ? this.authState.uid : '';
  }

  // Anonymous User
  get currentUserAnonymous(): boolean {
    return this.authenticated ? this.authState.isAnonymous : false
  }

  // Returns current user display name or Guest
  get currentUserDisplayName(): string {
    if (!this.authState) { return 'Guest' }
    else if (this.currentUserAnonymous) { return 'Anonymous' }
    else { return this.authState['displayName'] || 'User without a Name' }
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider()
    return this.socialSignIn(provider);
  }


  private socialSignIn(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) =>  {
          this.authState = credential.user
          this.updateUserData()
      })
      .catch(error => console.log(error));
  }


  //// Anonymous Auth ////
  anonymousLogin() {
    return this.afAuth.auth.signInAnonymously()
    .then((user) => {
      this.authState = user
      this.updateUserData()
    })
    .catch(error => console.log(error));
  }

  //// Email/Password Auth ////
  emailSignUp(email:string, password:string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((user) => {
        this.authState = user
        this.updateUserData()
      })
      .catch(error => console.log(error));
  }

  emailLogin(email:string, password:string) {
     return this.afAuth.auth.signInWithEmailAndPassword(email, password)
       .then((user) => {
         this.authState = user
         this.updateUserData()
       })
       .catch(error => console.log(error));
  }

  // Sends email allowing user to reset password
  resetPassword(email: string) {
    var auth = firebase.auth();

    return auth.sendPasswordResetEmail(email)
      .then(() => console.log("email sent"))
      .catch((error) => console.log(error))
  }


  //// Sign Out ////
  signOut(): void {
    let routerObj = this.router;
    let toastr = this.toastr;
    console.log("signout============")
    // this.afAuth.auth.signOut();  
    firebase.auth().signOut().then(function() {
      console.log('Signed Out');
      localStorage.removeItem('token');
      toastr.info('Sign Out', 'Sucessfully Signed Out!');
      routerObj.navigate(['/login'])
    }, function(error) {
      toastr.error('Sign Out', 'Sign Out Error!');
      console.error('Sign Out Error', error);
    });
  }


  //// Helpers ////
  private updateUserData(): void {
  // Writes user name and email to realtime db
  // useful if your app displays information about users or for admin features
  let path = `users/${this.currentUserId}`; // Endpoint on firebase
    let data = {
      email: this.authState.email,
      name: this.authState.displayName
    }
  this.db.object(path).update(data)
  .catch(error => console.log(error));

  }

  addUser(UserData): void{
    let data = {
    uid:this.currentUserId,
    displayName: UserData.displayName,
    email: this.authState.email,
    userLocation:UserData.userLocation
  }
  this.afs.collection("users").add(data);  
  }

  getUser(UserData) {
    return this.afs.collection("users").doc(UserData.uid).ref.get();
  }


  updateProfile(UserData, docid): void {
    let _DB = firebase.firestore();
    let data = {
      email: this.authState.email,
      displayName: UserData.displayName,
      uid:this.currentUserId,
      userLocation:UserData.userLocation
    }
      _DB.collection("users").doc(docid).update({
      "displayName": data.displayName,
      "userLocation": data.userLocation
      }).then((res) =>{
        console.log("reslult", res)
        this.toastr.success('Profile', 'Updated Sucessfully!');
      }).catch((err)=>{
        this.toastr.error('Error');
        console.log(err)
      })
    }

    pushUpload(upload: Upload, docID) {
      let storageRef = firebase.storage().ref();
      let uploadTask = storageRef.child(`${this.basePath}/${firebase.auth().currentUser.uid}`).put(upload.file);
      uploadTask.then((savedPicture) => {
      let url = storageRef.child(`${this.basePath}/${firebase.auth().currentUser.uid}`).getDownloadURL()
      url.then((link) => {
        console.log("url=====183",link)
        let _DB = firebase.firestore();
        _DB.collection("users").doc(docID).update({
        "photoURL":link
        }).then((res) =>{
          console.log("reslult", res)
        }).catch((err)=>{
          console.log(err)
        })
        var user = firebase.auth().currentUser;
        user.updateProfile({
        displayName: user.displayName,
        photoURL: link
        }).then(function() {
        console.log("Updated Successfully")
        // Update successful.
        }).catch(function(error) {
        console.log("error in update")
        }); 
      })
      })
    }
}