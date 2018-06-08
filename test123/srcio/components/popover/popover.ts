import { Component } from '@angular/core';
import { PopoverController, ViewController, Events, NavParams } from 'ionic-angular';

@Component({
  selector: 'popover',
  templateUrl: 'popover.html'
})
export class PopoverComponent {

  constructor(
    public popoverCtrl: PopoverController,
    public viewCtrl: ViewController,
    public events: Events,
    public navparam: NavParams
  ) {
  }

  close(type){
    this.events.publish("reportToSpam", {comment: this.navparam.data.comment, type: type});
    this.viewCtrl.dismiss();
  }
}
