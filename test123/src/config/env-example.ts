export const ENV = {
  production: false,
  firebase: {
    // apiKey: "AIzaSyCfJ-g2N5tf0fJA_TAI789iztKmPi8Ml_Q",
    // authDomain: "firestore-19609.firebaseapp.com",
    // projectId: "firestore-19609",
    // databaseURL: "https://firestore-19609.firebaseio.com",
    // storageBucket: "firestore-19609.appspot.com",
    // messagingSenderId: "858694626566"

    apiKey: "AIzaSyDtBQI610zlT3-zqQGID1anoqww6XFWZqY",
    authDomain: "mucicalapp.firebaseapp.com",
    databaseURL: "https://mucicalapp.firebaseio.com",
    projectId: "mucicalapp",
    storageBucket: "mucicalapp.appspot.com",
    messagingSenderId: "479711792108"
  }
}

export const messages = {
  homePageTitle: "Discussions",
  createDiscussionPageTitle: 'Add a new discussion',
  createDisSuccess: "Discussion created successfully",
  createDisFailed: "Adding document failed",
  profileUpdateSuccess: "Profile updated successfully",
  profileUpdateFailed: "Profile update failed",
  spamReport: "Successfully reported to admin!"
}

export const collections = {
  disscussion: 'Discussions',
  users: "users",
  spamReports: "spamReports",
  friends:"friends",
  messaging:"messaging",
  messages: "messages"  
}

