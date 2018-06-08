import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { DatabaseProvider } from '../../providers/database/database';
import { messages, collections } from '../../config/env-example'
import * as firebase from 'firebase';
import { Router } from '@angular/router';


@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css']
})
export class NetworkComponent implements OnInit {
  public listFlag:boolean = true;
  public friends      : any = [];
  public currentUser  : any = firebase.auth().currentUser;
  public frndDocId    : string;
  public tempArr      : any = [];
  constructor(private auth:AuthService, private _DB: DatabaseProvider,private router:Router) {  }
  public noData:boolean = false;

  ngOnInit() {
    this.friendsList()
  }

  friendsList() {
    this._DB.friendList(this.currentUser.uid)
      .then((result) => {
        this.frndDocId = result.id;
        this.friends = result.friends;
        this.tempArr = this.friends;
        this.friends.length == 0 ? this.noData=true:this.noData=false;
      })
      .catch((error) => {
      });
  }

  goToSearchUser(): void {
    this.router.navigate(['/buddies']);
  }

  search(value) {
    if (!value) {
      this.returnBlank();
    } else {
      this.friends = Object.assign([], this.tempArr).filter(
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
    this.friends = Object.assign([], this.tempArr);
  }


}
