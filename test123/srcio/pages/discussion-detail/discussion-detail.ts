import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { collections, messages } from '../../config/env-example';
import * as firebase from 'firebase';
import { CommonProvider } from '../../providers/common/common';
import { PopoverController } from 'ionic-angular';
import { PopoverComponent } from '../../components/popover/popover';
import { HomePage } from '../home/home';
import { AddCommentPage } from '../add-comment/add-comment';

@IonicPage()
@Component({
  selector: 'page-discussion-detail',
  templateUrl: 'discussion-detail.html',
})
export class DiscussionDetailPage {
  auth             : any = firebase.auth().currentUser;  
  discussionDetail : any = {};
  userInfo         : any = {};
  comments         : any[] = [];
  id               : any = this.navParams.data.id;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public _DB: DatabaseProvider,
    private common: CommonProvider,
    public popoverCtrl: PopoverController,
    public events: Events
  ) {

    this.events.subscribe("reportToSpam", (data) => {
      this.reportToSpam(data);
    })
  }

  ionViewDidEnter(){
    this.getDetail(this.id);
  }

  getDetail(id: string): void{
    this.common.presentLoading();
    this._DB.getDiscussionDetail(collections.disscussion, id)
    .then((result) => {
      if(!this.common.isEmpty(result)) {
        this.discussionDetail = result;
        this.userInfo         = result.userInfo;
        this.comments         = result.comments;
      } else {
        this.common.showToast("Failed!")
        this.navCtrl.setRoot(HomePage);
      }
      this.common.dismissLoading();
    })
    .catch((err) => {
      console.log("error")
    });
  }

  /**
   * get date and month name from timestamp 
   * 
   * @public
   * @param {timestamp}
   */
  getDate(timestamp: string){
    return  this.common.getDate(timestamp);
  }

  presentPopover(myEvent, comment) {
    let popover = this.popoverCtrl.create(PopoverComponent, {comment: comment});
    popover.present({
      ev: myEvent
    });
   
  }

  /**
   * Report to spam the discussion
   * 
   * @public
   * @param {none}
   */
  reportToSpam(data): void{
    this.common.presentLoading();
    let currentDate = new Date();
    let spam = {
      discussionId : this.discussionDetail.id,
      uid     : this.auth.uid,
      commentDate: currentDate.getTime(),
      comment: data.comment,
      type: data.type
    }
    this._DB.addDocument(collections.spamReports, spam)
    .then((result) => {
      this.common.dismissLoading();
      this.common.showToast(messages.spamReport)
    }).catch((error) => {

    })
  }

  goToAddComment(){
    this.navCtrl.push(AddCommentPage, {id: this.navParams.data.id});
  }
}
