import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { CreateDiscussionPage } from '../create-discussion/create-discussion'
import { messages, collections } from '../../config/env-example';
import { CommonProvider } from '../../providers/common/common'
import { DiscussionDetailPage } from '../discussion-detail/discussion-detail';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  pageTitle          : any = messages.homePageTitle
  _CONTENT  	       : any;
  _COLL              : string = collections.disscussion;
  discussions        : any[] = [];
  showMe             : boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    private _DB: DatabaseProvider,
    private common: CommonProvider
  ) {
  }


   /**
    * Retrieve all discussion from the specified collection using the
    * retrieveCollection method when the view is entered
    * Created: 28-May-2018
    *
    * @public
    * @method ionViewDidEnter
    * @return {none}
    */
    ionViewDidEnter()
    {
       this.retrieveCollection();
    }
 
    /**
     * Retrieve all discussions from the specified collection using the
     * getdiscussions method of the DatabaseProvider service
     *
     * @public
     * @method retrieveCollection
     * @return {none}
     */
    retrieveCollection() {      
      this.common.presentLoading()
       this._DB.getDiscussions(this._COLL)
       .then((data) =>
       {          
          this.discussions = data;
          this.showMe = true;          
       })
       .catch((err) => {
          this.showMe = true;
       });
    }
  
  /**
   * get date and month name from timestamp 
   * 
   */
  getDate(timestamp){
    return  this.common.getDate(timestamp);
  }

  public goToCreateDiss(){
    this.navCtrl.push(CreateDiscussionPage);
  }

  /**
   * redirction on detail screen
   * 
   * @public
   * @param id
   */
  detail(id){
    this.navCtrl.push(DiscussionDetailPage, {id: id});
  }
}
