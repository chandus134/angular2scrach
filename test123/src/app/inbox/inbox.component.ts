import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { DatabaseProvider } from '../../providers/database/database';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {
  public inboxList : any[] = [];
  constructor(private _DB: DatabaseProvider,private toastr: ToastrService, private router:Router) { }

  ngOnInit() {
    this.getInboxList();    
  }

  /**
   * Retrieve inbox list
   * 
   */
  getInboxList() {
    this._DB.inboxList(firebase.auth().currentUser.uid)
      .then((res) => {       
        console.log("this.inboxList",res)
        this.inboxList = res;
      })
      .catch((error) => {
      })
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

  public goToChat(item){
      this.router.navigate(['chat',{user: JSON.stringify(item)}])
  }

}
