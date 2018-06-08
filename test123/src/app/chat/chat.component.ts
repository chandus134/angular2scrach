import { Component, OnInit, ViewChild } from '@angular/core';
import * as firebase from 'firebase';
import { collections } from '../../config/env-example';
// import 'rxjs/add/operator/map';
import { DatabaseProvider } from '../../providers/database/database';
import {Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  // @ViewChild('content') content: Content;
  public chatWith:object = {};
  public newmessage;
  public allmessages: any = [];
  public currentUser = firebase.auth().currentUser;
  public docId: any;
  constructor( public _DB: DatabaseProvider,private activeRoute: ActivatedRoute, private router:Router) { }
  
  ngOnInit() {
    this.getChatHistory(); //Calling function for get one to one chat history at the time of page loading    
    console.log(this.activeRoute.snapshot.queryParams,"query params")
    console.log(this.activeRoute.snapshot.params, "params")
  }


  /**
   * Send new message to destination user
   * 
   * @public
   */
  public addmessage() {
    let chatWith = JSON.parse(this.activeRoute.snapshot.params.user);
    this._DB.sendMsg(this.currentUser.uid, chatWith.uid, this.newmessage)
      .then((result) => {
        // this.content.scrollToBottom();        
      })
      .catch((error) => {
        console.log(error);
      })
    this.newmessage = '';
    
  }

  /**
   * retrieve one to one chat history from messaging collection
   * 
   * @public
   */
  public getChatHistory() {
    let chatWith = JSON.parse(this.activeRoute.snapshot.params.user);    
    this._DB.getChatHistory(firebase.auth().currentUser.uid, chatWith.uid)
      .then((res) => {
        console.log(this.allmessages,"this.allmessages")        
        this.allmessages = res;
        this.docId = this.allmessages.docId
        // this.scrollto();
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
      let db = firebase.firestore();
      db.collection(collections.messaging).doc(this.docId).collection(collections.messages)
        .orderBy('sent')
        .onSnapshot(function (doc) {                   
          if (doc.docs.length != 0) {
            console.log("starting length", allmsgLength)
            for (let i = allmsgLength; i < doc.docs.length; i++) {
              let obj = doc.docs[i];
              allmessages.push({
                id: obj.id,
                message: obj.data().message,
                sender: obj.data().sender,
                sent: obj.data().tiemstamp,
              });
              allmsgLength++;
              console.log("plus length", allmsgLength)
            }
          }
        });
        this.allmessages = allmessages        
        // this.scrollto();       
    } 
  }

  /**
   * scrolling in page bottom on new message
   */
  // scrollto() {
  //   setTimeout(() => {
  //     this.content.scrollToBottom();
  //   }, 1000);
  // }
  goToInbox(){
    this.router.navigate(['inbox'])
  }

}
