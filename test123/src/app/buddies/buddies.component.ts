import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DatabaseProvider } from '../../providers/database/database';
import * as firebase from 'firebase';

@Component({
  selector: 'app-buddies',
  templateUrl: './buddies.component.html',
  styleUrls: ['./buddies.component.css']
})
export class BuddiesComponent implements OnInit {
  public buddies: any = [];
  public tempArr: any = [];
  public auth: any = firebase.auth().currentUser;
  public showMe: boolean = false;
  public searchText: any;

  public friends      : any = [];
  public currentUser  : any = firebase.auth().currentUser;
  public frndDocId    : string;
  constructor( private _DB: DatabaseProvider,private router:Router) { }

  ngOnInit() {
    this.retrieveBuddies();
  }

  retrieveBuddies() {
    this._DB.getAllBuddies(this.auth.uid)
      .then((data) => {
        let removeCurrentUserIndex = data.map(function(item) { return item.uid; }).indexOf(this.auth.uid);
        data.splice(removeCurrentUserIndex, 1);
        this._DB.friendList(this.currentUser.uid)
        .then((result) => {
            result.friends.forEach(element => {
              let removeIndex = data.map(function(item) { return item.uid; }).indexOf(element.uid);
              if(removeIndex != -1){
                data.splice(removeIndex, 1);
              }
            });
            this.buddies = data;
            this.tempArr = data;
            this.showMe = true;
        })
        .catch((error) => {
        });
      })
      .catch((err) => {
      });
  }

  search(value) {
    if (!value) {
      this.returnBlank();
    } else {
      this.buddies = Object.assign([], this.tempArr).filter(
        item => {
          if (item.displayName.toLowerCase().indexOf(value.toLowerCase()) > -1) {
            return true;
          } else {
            return false;
          }
        })
    }
  }

  returnBlank() {
    this.buddies = Object.assign([], this.tempArr);
  }

  addInNetwork(uid){
    this._DB.addInNetwork(this.auth.uid, uid)
    .then((result) =>{
      var removeIndex = this.buddies.map(function(item) { return item.uid; }).indexOf(uid);
      this.buddies.splice(removeIndex, 1);      
    })
    .catch((error) => {
      console.log(error)
    })
  }

  goToNetwork(){
    this.router.navigate(['/network']);
  }

}
