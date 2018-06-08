import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { CommonProvider } from '../../providers/common/common';
import { messages, collections } from '../../config/env-example'
import { HomePage } from '../home/home';
import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-create-discussion',
  templateUrl: 'create-discussion.html',
})
export class CreateDiscussionPage {

  userId : any = firebase.auth().currentUser.uid;  
  
  /**
   * @name form
   * @type {object}
   * @public
   * @description     Defines an object for handling form validation
   */
  public form: any;

  /**
   * @name records
   * @type {object}
   * @public
   * @description     Defines an object for returning documents from Cloud Firestore database
   */
  public records: any;

  /**
   * @name discussionTitle
   * @type {string}
   * @public
   * @description     Model for discussionTitle form field
   */
  public discussionTitle: string = '';

  /**
   * @name discussionDesc
   * @type {string}
   * @public
   * @description     Model for discussionDesc form field
   */
  public discussionDesc: string = '';

  /**
   * @name title
   * @type {string}
   * @public
   * @description     property that defines the template title value
   */
  public title: string = messages.createDiscussionPageTitle;

  /**
   * @name _COLL
   * @type {string}
   * @private
   * @description     property that stores the value for the database collection
   */
  private _COLL: string = collections.disscussion;


  constructor(public navCtrl: NavController,
    public params: NavParams,
    private _FB: FormBuilder,
    private _DB: DatabaseProvider,
    private _ALERT: AlertController,
    private _Common: CommonProvider
  ) {
    // Use Formbuilder API to create a FormGroup object
    // that will be used to programmatically control the
    // form / form fields in the component template
    this.form = _FB.group({
      'discussionTitle': ['', Validators.required],
      'discussionDesc': ['', Validators.required]
    });
  }

  /**
   * Saves form data as newly added/edited record within Firebase Realtime
   * database and handles uploading of media asset to Firebase Storage
   *
   * @public
   * @method saveDocument
   * @param  val          {any}              Form data
   * @return {none}
   */
  saveDocument(val: any): void {
    let currentdate = new Date();
    let timestamp = currentdate.getTime();
    let discussionTitle: string = this.form.controls["discussionTitle"].value,
      discussionDesc: string = this.form.controls["discussionDesc"].value,
      createdat: any = timestamp,
      userId: any = this.userId

      // Call the DatabaseProvider service and pass/format the data for use
      // with the addDocument method
      this._Common.presentLoading();
      this._DB.addDocument(this._COLL,
        {
          discussionTitle: discussionTitle,
          discussionDesc: discussionDesc,          
          createdAt: createdat,
          userId: userId,
          comments: []
        })
        .then((data) => {
          this.clearForm();
          this._Common.dismissLoading();
          this._Common.showToast(messages.createDisSuccess);
          this.navCtrl.setRoot(HomePage)
        })
        .catch((error) => {
          this._Common.dismissLoading();
          this._Common.showToast(messages.createDisFailed+  error.message);
        });
  }

  /**
   * Clear all form data
   *
   * @public
   * @method clearForm
   * @return {none}
   */
  clearForm(): void {
    this.discussionTitle = '';
    this.discussionDesc = '';
  }


}

