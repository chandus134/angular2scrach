import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { CommonProvider } from '../../providers/common/common'
import * as firebase from 'firebase';
import { collections } from '../../config/env-example';
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  @ViewChild('content') content: Content;
  public chatWith = this.navParams.data.user;
  public newmessage;
  public allmessages: any = [];
  public currentUser = firebase.auth().currentUser;
  public docId: any;
  db = firebase.firestore();
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public _DB: DatabaseProvider,
    public common: CommonProvider
  ) {
    this.checkChatPair(); //Calling function for get one to one chat history at the time of page loading
  }

  ionViewWillLeave() {
    var unsubscribe = this.db.collection(collections.messaging).doc(this.docId).collection(collections.messages)
      .orderBy('sent')
      .onSnapshot(function () { });
    // Stop listening to changes
    unsubscribe();
  }
  /**
   * Send new message to destination user
   * 
   * @public
   */
  public addmessage() {
    if (this.newmessage) {
      this._DB.sendMsg(this.currentUser.uid, this.chatWith.uid, this.newmessage)
        .then((result) => {
          this.content.scrollToBottom();
        })
        .catch((error) => {
          console.log(error);
        })
      this.newmessage = '';
    }
  }

  /**
   * retrieve one to one chat history from messaging collection
   * 
   * @public
   */
  public checkChatPair() {
    this.common.presentLoading();
    this._DB.chatPair(firebase.auth().currentUser.uid, this.chatWith.uid)
      .then((res: any) => {
        this.docId = res.docId;
        this.getChatHistory();
      })
      .catch((error) => {
      })
  }

  /**
   * retrieve one to one chat history from messaging collection
   * 
   * @public
   */
  public getChatHistory() {
    this._DB.getChatHistory(firebase.auth().currentUser.uid, this.chatWith.uid, this.docId)
      .then((res) => {
        this.allmessages = res;
        this.scrollto();
        this.watchMsg();
      })
      .catch((error) => {
      })
  }

  /**
   * watching new message
   * 
   * @public
   * @param docId
   */
  public watchMsg() {
    if (this.docId) {
      var allmsgLength = this.allmessages.length;
      var allmessages = this.allmessages;
      var scroll = this.scrollto();
      this.db.collection(collections.messaging).doc(this.docId).collection(collections.messages)
        .orderBy('sent')
        .onSnapshot(function (doc) {
          if (doc.docs.length != 0) {
            console.log(doc.docs.length, "starting length", allmsgLength)
            let doclength = doc.docs.length;
            for (let i = allmsgLength; i < doclength; i++) {
              let obj = doc.docs[i];
              allmessages.push({
                id: obj.id,
                message: obj.data().message,
                sender: obj.data().sender,
                sent: obj.data().tiemstamp,
              }); 
              allmsgLength++;              
            console.log( obj.data(),"plus length", allmsgLength)
            }
            // scroll;
        }
      });
    }
  }

  /**
   * scrolling in page bottom on new message
   */
  scrollto() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 1000);
  }
}
