import { Component, OnInit } from '@angular/core';
import { DatabaseProvider } from '../../../providers/database/database';
import { Router } from '@angular/router';


@Component({
  selector: 'app-spam',
  templateUrl: './spam.component.html',
  styleUrls: ['./spam.component.css']
})
export class SpamComponent implements OnInit {
  spamlist:any = [];
  constructor(private _DB: DatabaseProvider, private router:Router) { }

  ngOnInit() {
    this.retrieveSpamReports();
  }
  
  retrieveSpamReports() {
    this._DB.getAllSpamReports().then((spamreports) => {
      this.spamlist = spamreports;
      console.log(spamreports,"====spamreports======")
    }).catch((error) => {
    });  
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

  goto(){
    this.router.navigate(['/admindashboard'])
  }

}
