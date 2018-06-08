import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { collections } from '../../config/env-example';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonProvider } from '../../providers/common/common';
import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-add-comment',
  templateUrl: 'add-comment.html',
})
export class AddCommentPage {
  public form      : any; 
  auth             : any = firebase.auth().currentUser;  
  comment          : any;
  id               : any = this.navParams.data.id;
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private _FB: FormBuilder,
    public _DB: DatabaseProvider,
    private common: CommonProvider,
  ) {    
    this.form = _FB.group({
      'comment': ['', Validators.required]
    });
  }


  /**
   * Add comment on discussion
   * 
   * @public
   * @param {form, uid will access user email, comment timestapm}
   */
  addComment(): void{
    this.common.presentLoading();
    let currentDate = new Date();
    let comments = {
      comment : this.form.controls['comment'].value,
      uid     : this.auth.uid,
      commentDate: currentDate.getTime()
    }
    this._DB.addComment(collections.disscussion, comments, this.id)
    .then((result) => {
      console.log(result)
      let userInfo = {
        displayName: this.auth.displayName,
        photoURL: this.auth.photoURL
      }
      Object.assign(comments, userInfo);
      this.navCtrl.pop();
      this.clearForm();
      this.common.dismissLoading();
    }).catch((error) => {

    })
  }

  /**
   * Clear form after comment submit
   * 
   * @public
   */
  clearForm(): void {
    this.comment = '';
  }

}
