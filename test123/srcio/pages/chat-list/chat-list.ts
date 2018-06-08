import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { CommonProvider } from '../../providers/common/common'
import { ChatPage } from '../chat/chat'
import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-chat-list',
  templateUrl: 'chat-list.html',
})
export class ChatListPage {
  public inboxList : any[] = [];
  public showMe: boolean;
  public arrLength : number = 0;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public _DB: DatabaseProvider,
    public common: CommonProvider
  ) {
  }

  ionViewDidEnter(){
    this.showMe = false;
    this.getInboxList();
  }
  /**
   * Retrieve inbox list
   * 
   */
  getInboxList() {
    this.common.presentLoading();
    this._DB.inboxList(firebase.auth().currentUser.uid)
      .then((res) => {
        console.log(res)   
        this.inboxList = res;
        setTimeout(() => {
          this.showMe = true;
        },1000);        
      })
      .catch((error) => {
        this.showMe = true;
      })
  }

  getDate(timestamp: string){
    return  this.common.getDate(timestamp);
  }

  public goToChat(item){
      this.navCtrl.push(ChatPage, {user: item})
  }

}
