/** Provider file created for call API's
 * Created: 25-May-2018
 * Creator: Jagdish Thakre
*/
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Headers, Http } from '@angular/http';
import { ENV } from '../../config/env-example'

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable()
export class HttpServiceProvider {

  constructor(
    public http: Http,
    public events: Events
  ) {
  }

  createAuthorizationHeader(headers: Headers) {
    headers.append('Content-Type', 'application/json; charset=utf-8');
  }

  /**
   * Function created for deno notification test
   */

  sendDemoNotification(devicetoken, msg, displayName) {  
  let body = {
      "notification":{
        "title": displayName,
        "body": msg,
        "sound":"default",
        "click_action":"FCM_PLUGIN_ACTIVITY",
        "icon":"fcm_push_icon"
      },
      "data":{
        "param1":"value1",
        "param2":"value2"
      },
        "to": devicetoken,
        "priority":"high",
        "restricted_package_name":"",
        "content_available": true
    }
    let headers = new Headers();
    headers.append('Authorization', 'key='+ENV.fcmAuthKey);
    let options: any = {
      headers: headers
    };
    // let options = new HttpHeaders().set('Content-Type','application/json');
    this.http.post("https://fcm.googleapis.com/fcm/send",body,options)
      .subscribe();
  }
}
