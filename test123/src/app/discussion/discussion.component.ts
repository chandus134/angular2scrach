import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { DatabaseProvider } from '../../providers/database/database';
import { messages, collections } from '../../config/env-example'
import * as firebase from 'firebase';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.css']
})
export class DiscussionComponent implements OnInit {
  createFlag:boolean = false;
  detailsFlag:boolean = false;
  listFlag:boolean = true;
  discussionObj:object = {};
  userId:string;
  comments:Array<any> = [];
  discussions:Array<any> = [];
  discussionDetail : any = {};
  userInfo         : any = {};
  comment:string='';
  userDetails:any={};
  constructor(private auth:AuthService, private _DB: DatabaseProvider,private toastr: ToastrService) { 
    this._DB.getDiscussions('Discussions')
       .then((data) =>
       {          
          this.discussions = data;
          console.log(this.discussions)
       })
       .catch((err) => {
       });
  }

  ngOnInit() {

  }

  listDiscussions(): void {
    this._DB.getDiscussions('Discussions')
       .then((data) =>
       {          
          this.discussions = data;
          console.log(this.discussions)
       })
       .catch((err) => {
       });
  }

  
  createDiscussion(){
    this.createFlag = true;
    this.detailsFlag = false;
    this.listFlag = false;

    this.userId = this.auth.currentUser.uid;
    this.userDetails = this.auth.currentUser;
    console.log(this.createFlag,"this.createFlag")
  }
  
  addDiscussion(data){
    let currentdate = new Date();
    let timestamp = currentdate.getTime();
    data.createdAt = timestamp;
    data.userId = this.userId;
    data.comments = this.comments;
    console.log(data,"data")
       
    this._DB.addDocument('Discussions',data)
      .then((data) => {
        this.toastr.success('Created Sucessfully!');
        console.log(data,"======data====38")
        this.clearForm();
        this.listDiscussions()
      })
      .catch((error) => {
      });
  }

  getDiscussionDetail(id: string): void{
    this._DB.getDiscussionDetail(collections.disscussion, id)
    .then((result) => {
      console.log("result ", result);
      this.discussionDetail = result;
      this.userInfo         = result.userInfo;
      this.comments         = result.comments;

      this.listFlag = false;
      this.createFlag = false;
      this.detailsFlag = true;
    })
    .catch((err) => {
      console.log("error")
    });
  }

  addComment(comment, id): void{
    let currentDate = new Date();
    let commentsObj = {
      comment : comment,
      uid     : this.auth.currentUser.uid,
      commentDate: currentDate.getTime(),
      photoURL : this.auth.currentUser.photoURL?this.auth.currentUser.photoURL:''
    }
    this._DB.addComment(collections.disscussion, commentsObj, id)
    .then((result) => {
      this.toastr.success('Comment Posted sucessfully!');
      let userInfo = {
        displayName: this.auth.currentUser.displayName,
        photoURL: this.auth.currentUser.photoURL
      }
      this.comment = '';
      let cmnt = Object.assign(commentsObj, userInfo);
      this.comments.push(cmnt);
    }).catch((error) => {
      this.toastr.error('Error Occured');
    })
  }


  reportToSpam(type:number): void{
    let currentDate = new Date();
    let spam = {
      discussionId : this.discussionDetail.id,
      uid     : this.auth.currentUser.uid,
      commentDate: currentDate.getTime(),
      reportType : type
    }
    this._DB.addDocument(collections.spamReports, spam)
    .then((result) => {
      this.toastr.success('Reported Sucessfully!');
    }).catch((error) => {
      this.toastr.error('Error Occured');
    })
  }

  reportToSpamComment(description:string,type:number): void{
    let currentDate = new Date();
    let spam = {
      discussionId : this.discussionDetail.id,
      uid     : this.auth.currentUser.uid,
      commentDate: currentDate.getTime(),
      reportType : type,
      comment: description
    }
    this._DB.addDocument(collections.spamReports, spam)
    .then((result) => {
      this.toastr.success('Reported Sucessfully!');      
    }).catch((error) => {
      this.toastr.error('Error Occured');
    })
  }

  clearForm(): void {
    this.discussionObj = {};
    this.createFlag = false;
    this.detailsFlag = false;
    this.listFlag = true;
  }

  monthName(month){
    let monthArr = new Array();
        monthArr[0] = "January";
        monthArr[1] = "February";
        monthArr[2] = "March";
        monthArr[3] = "April";
        monthArr[4] = "May";
        monthArr[5] = "June";
        monthArr[6] = "July";
        monthArr[7] = "August";
        monthArr[8] = "September";
        monthArr[9] = "October";
        monthArr[10] = "November";
        monthArr[11] = "December";
        return monthArr[month];
  }

   getDate(timestamp: string){
    let date = new Date(timestamp);
    let datetime = this.monthName(date.getMonth()) + ' ' + date.getDate();
    return datetime;
  }
}
