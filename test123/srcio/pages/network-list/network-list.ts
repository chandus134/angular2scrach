import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { CommonProvider } from '../../providers/common/common'
import * as firebase from 'firebase';
import { BuddiesPage } from '../buddies/buddies';
import { ChatPage } from '../chat/chat';

@IonicPage()
@Component({
  selector: 'page-network-list',
  templateUrl: 'network-list.html',
})
export class NetworkListPage {
  public toggled      : boolean = false;
  public friends      : any[] = [];
  public showMe       : boolean = false;
  public currentUser  : any = firebase.auth().currentUser;
  public frndDocId    : string;
  public tempArr      : any[] = [];
  public tempArrLength: number = 0;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public _DB: DatabaseProvider,
    public common: CommonProvider
  ) {    
  }

  ionViewDidEnter() {
    this.friendsList();
  }

  /**
   * retreive friend list from based on current user id
   * 
   * @public
   */
  friendsList() {
    this.common.presentLoading();
    this._DB.friendList(this.currentUser.uid)
      .then((result) => {
        this.showMe = true;
        this.frndDocId = result.id;
        this.friends = result.friends;      
        this.tempArr = this.friends;
        this.tempArrLength = this.tempArr.length;
        this.common.dismissLoading();
      })
      .catch((error) => {
      });
  }

  /**
   * redirect to search buddies who is not in contact list
   * 
   * @public
   */
  goToSearchUser(): void {
    this.navCtrl.push(BuddiesPage);
  }

  /**
   * Search contact who in friend list
   * @param value 
   */
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
      this.tempArrLength = this.friends.length;  
    }
  }

  returnBlank() {
    this.friends = Object.assign([], this.tempArr);
  }

  onClear() {
    this.returnBlank();
  }

  toggle(): void {
    this.toggled = !this.toggled;
  }

  /**
   * Open chat screen
   * @param item 
   */
  goToChat(item){
    if(!item.isAccepted || item.isAccepted == 2){
      this.navCtrl.push(ChatPage, {user: item})
    }    
  }

}
