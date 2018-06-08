/** Provider file created for use common function 
 * Created: 23-May-2018
 * Creator: Jagdish Thakre
*/
import { Injectable } from '@angular/core';
import { AlertController, Platform, LoadingController, ToastController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';


@Injectable()
export class CommonProvider {
  loading: any;
  constructor(
    public alertCtrl: AlertController,
    public platform: Platform,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private socialSharing: SocialSharing
  ) {
  }

  // https://codecanyon.net/item/ionic3woodokanstore-ionic3-dokan-multi-vendor-woocommerce-app/20155139?s_rank=7

  /**
   * Function created for show toast message
   * Created: 23-May-2018
   * Creator: Jagdish Thakre
   */
  showToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 4000,
      position: 'bottom'
    });
    toast.present()
  }
  /**
   * Function created for show alert message
   * Created: 23-May-2018
   * Creator: Jagdish Thakre
   */
  showAlert(message) {
    const alert = this.alertCtrl.create({
      title: 'Alert',
      subTitle: message,
      buttons: ['Ok']
    });
    alert.present();
  }
  /**
   * Function created for show loader bar
   * Created: 23-May-2018
   * Creator: Jagdish Thakre
   */
  presentLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Loading, Please wait...',
      duration: 2000
    });

    this.loading.present();
  }

  dismissLoading() {
    this.loading.dismiss();
  }

  logoutLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Session has been expired...'
    });
    this.loading.present();
  }

  /**
   * Function created for share application via social share link
   * Created: 28-May-2018
   * Creator: Jagdish Thakre
   */
  shareApp() {
    // Check if sharing via email is supported
    //https://zcast.swncdn.com/episodes/zcast/ankerberg-q-and-a/2017/05-02/591812/805_2017417112138004.jpg
    this.socialSharing.share('Body', 'Subject', 'www/assets/images/musician_logo.png', "https://ionicframework.com/").then(() => {
      // Sharing via email is possible
    }).catch(() => {
      // Sharing via email is not possible
    });
  }

  monthName(month) {
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

  /**
   * get date and month name from timestamp 
   * 
   * @public
   * @param timestamp 
   * @return {montname and date}
   */
  getDate(timestamp) {
    let date = new Date(timestamp);
    let datetime = this.monthName(date.getMonth()) + ' ' + date.getDate();
    return datetime;
  }

  isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }
}