import { Component, OnInit } from '@angular/core';
import { DatabaseProvider } from '../../../providers/database/database';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
userlist:any = []
  constructor( private _DB: DatabaseProvider, private router:Router) { }

  ngOnInit() {
    this.retrieveUsers();
  } 
  
  retrieveUsers() {
    this._DB.getAllUsers().then((users) => {
      console.log(users,"====users======")
      this.userlist = users;
    }).catch((error) => {

    });
  }

  goto(){
    this.router.navigate(['/admindashboard'])
  }
}
