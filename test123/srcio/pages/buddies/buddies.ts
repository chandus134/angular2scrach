import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { CommonProvider } from '../../providers/common/common'
import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-buddies',
  templateUrl: 'buddies.html',
})
export class BuddiesPage {
  buddies: any = [];
  tempArr: any = [];
  auth: any = firebase.auth().currentUser;
  showMe: boolean = false;
  searchText: any;
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public _DB: DatabaseProvider,
    public common: CommonProvider
  ) {
  }

  ionViewDidLoad() {
    this.retrieveBuddies();
  }

  /**
     * Retrieve all buddies from the users collection using the
     * getAllBuddies method of the DatabaseProvider service
     *
     * @public
     * @method retrieveBuddies
     * @return {none}
     */

  retrieveBuddies() {
    this.common.presentLoading()
    this._DB.getAllBuddies(this.auth.uid)
      .then((data) => {
        let removeCurrentUserIndex = data.map(function(item) { return item.uid; }).indexOf(this.auth.uid);
        data.splice(removeCurrentUserIndex, 1);
        this._DB.friendList(this.auth.uid)
        .then((result) => {
          if(result.friends){
            result.friends.forEach(element => {
              let removeIndex = data.map(function(item) { return item.uid; }).indexOf(element.uid);
              if(removeIndex != -1){
                data.splice(removeIndex, 1);
              }
            });
            this.buddies = data;
            this.tempArr = data;
          } else {
            this.buddies = data;
            this.tempArr = data;
          }            
            // this.common.dismissLoading();
        })
        .catch((error) => {
        });
         setTimeout(() =>{
          this.showMe = true;
         }, 1000) 
         this.common.dismissLoading();       
      })
      .catch((err) => {
      });
  }

  /**
   * Search buddies to by name
   * 
   * @public
   */
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

  /**
   * Merge temparray with blank array
   * 
   * @public
   */
  returnBlank() {
    this.buddies = Object.assign([], this.tempArr);
  }

  /**
   * On click on search click button make original list
   * 
   * @public
   * */  
  onClear() {
    this.returnBlank();
  }

  /**
   * Add in friend list
   * 
   * @public
   * @param uid 
   */
  addInNetwork(uid){
    this.common.presentLoading();
    this._DB.addInNetwork(this.auth.uid, uid)
    .then((result) =>{
      // this.common.dismissLoading();
      console.log(result)
      var removeIndex = this.buddies.map(function(item) { return item.uid; }).indexOf(uid);
      this.buddies.splice(removeIndex, 1);
      
    })
    .catch((error) => {
      console.log(error)
    })
  }

  /**
   * Invite friends by social sharing link who is not using application
   * 
   * @public
   */
  invite(){
    this.common.shareApp();
  }
}
