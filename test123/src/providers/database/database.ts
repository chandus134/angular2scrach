// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// Import firebase and firestore
import * as firebase from 'firebase';
import 'firebase/firestore';
import { collections } from '../../config/env-example';


@Injectable()
export class DatabaseProvider {

  private _DB: any;

  constructor(
  ) {
    this._DB = firebase.firestore();
    // const settings = {/* your settings... */ timestampsInSnapshots: true};
    // this._DB.settings(settings);
  }

  /**
  * Create the database collection and defines an initial document
  * Note the use of merge : true flag within the returned promise  - this
  * is needed to ensure that the collection is not repeatedly recreated should
  * this method be called again (we DON'T want to overwrite our discussions!)
  */

  createAndPopulateDocument(collectionObj: string,
    docID: string,
    dataObj: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._DB
        .collection(collectionObj)
        .doc(docID)
        .set(dataObj, { merge: true })
        .then((data: any) => {
          resolve(data);
        })
        .catch((error: any) => {
          reject(error);
        })
    })
  }

  /*
   * Return discussions from specific database collection
   */

  getDiscussions(collectionObj: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this._DB.collection(collectionObj)
        .get()
        .then((querySnapshot) => {
          let obj: any = [];
          for (let i = 0; i < querySnapshot.docs.length; i++) {
            let doc = querySnapshot.docs[i];
            // this._DB.collection("users").where("uid", "==", doc.data().userId).get().then((snapres) =>{
            //   if(snapres.docs.length != 0){
            obj.push({
              id: doc.id,
              discussionTitle: doc.data().discussionTitle,
              discussionDesc: doc.data().discussionDesc,
              createdAt: doc.data().createdAt,
              comments:  doc.data().comments
              // userInfo: snapres.docs[0].data()
            });
            //   }
            // }) 
            if (i == querySnapshot.docs.length - 1) {
              resolve(obj);
            }
          }

          // resolve(obj);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  /**
   * Add a new document to a selected database collection
   */

  addDocument(collectionObj: string,
    dataObj: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._DB.collection(collectionObj).add(dataObj)
        .then((obj: any) => {
          resolve(obj);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  /**
   * Delete an existing document from a selected database collection
   */

  deleteDocument(collectionObj: string, docID: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this._DB
        .collection(collectionObj)
        .doc(docID)
        .delete()
        .then((obj: any) => {
          resolve(obj);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  /**
   * Update an existing document within a selected database collection
   */

  updateDocument(collectionObj: string,
    docID: string,
    dataObj: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._DB
        .collection(collectionObj)
        .doc(docID)
        .update(dataObj)
        .then((obj: any) => {
          resolve(obj);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  /**
   * Get user profile information
   */
  getProfile(uid: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this._DB.collection(collections.users)
        .where("uid", "==", uid)
        .get()
        .then((querySnapshot) => {
          let doc = querySnapshot.docs[0];
          let obj = {
            id: doc.id,
            displayName: doc.data().displayName,
            photoURL: doc.data().photoURL,
            userLocation: doc.data().userLocation,
            uid: doc.data().uid
          };
          resolve(obj);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }


  /**
   * Retrive discussion detail with comments
   * 
   * @public
   * @param {collection name & docid}
   */
  /*
   * Return discussions from specific database collection
   */

  getDiscussionDetail(collectionObj: string, docId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this._DB.collection(collectionObj)
        .doc(docId)
        .get()
        .then((doc) => {
          let obj: any = {};
          if (doc.exists) {
            this._DB.collection("users")
              .where("uid", "==", doc.data().userId)
              .get()
              .then((snapres) => {                
                if (snapres.docs.length != 0) {
                  obj = doc.data();
                  obj.id = doc.id;
                  obj.userInfo = snapres.docs[0].data();
                  if (obj.comments.length == 0) {
                    resolve(obj);
                  } else {
                    for (let i = 0; i < obj.comments.length; i++) {
                      let cmnt = obj.comments[i];
                      this.getProfile(cmnt.uid).
                        then((result) => {
                          obj.comments[i] = Object.assign(cmnt, result);
                        })
                        .catch((err) => { });

                      if (i == doc.data().comments.length - 1) {
                        resolve(obj);
                      }
                    }
                  }
                  // resolve(obj);
                } else {
                  resolve(obj);
                }
              })
              .catch((error: any) => {
                reject(error);
              });
          } else {
            resolve(obj);
          }

        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }


  /**
   * add comment in discussion
   */
  addComment(collectionObj: string,
    dataObj: any, docId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const userRef = this._DB.collection(collectionObj).doc(docId);
      this._DB.runTransaction(transaction => {
        return transaction.get(userRef).then(doc => {
          if (!doc.data().comments) {
            transaction.set({
              bookings: [dataObj]
            });
          } else {
            const comments = doc.data().comments;
            comments.push(dataObj);
            transaction.update(userRef, { comments: comments });
          }
        });
      }).then(function (obj) {
        resolve(obj);
      }).catch(function (error) {
        reject(error);
      });
    });
  }

  /**
   * retrive buddies list who is not available in own friend list
   * 
   */
  getAllBuddies(uid: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this._DB.collection(collections.users)
        // .where("uid", "<>", uid)
        .get()
        .then((querySnapshot) => {
          let obj: any = [];
          if (querySnapshot.docs.length == 0) {
            resolve(obj);
          } else {
            for (let i = 0; i < querySnapshot.docs.length; i++) {
              let doc = querySnapshot.docs[i];
              // this._DB.collection("users").where("uid", "==", doc.data().userId).get().then((snapres) =>{
              //   if(snapres.docs.length != 0){
              obj.push({
                id: doc.id,
                displayName: doc.data().displayName,
                photoURL: doc.data().photoURL,
                userLocation: doc.data().userLocation,
                uid: doc.data().uid
              });
              //   }
              // }) 
              if (i == querySnapshot.docs.length - 1) {
                resolve(obj);
              }
            }
          }
          // resolve(obj);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  /**
   * retrive friends list
   * 
   */
  friendList(uid: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this._DB.collection(collections.friends)
        .where("uid", "==", uid)
        .get()
        .then((querySnapshot) => {
          let obj: any = [];
          if (querySnapshot.docs.length == 0) {
            resolve(obj);
          } else {
            let doc = querySnapshot.docs[0];
            obj = doc.data();
            obj.id = doc.id;
            for (let i = 0; i < obj.friends.length; i++) {
              let frnd = obj.friends[i];
              this.getProfile(frnd.uid).
                then((result) => {
                  obj.friends[i] = Object.assign(frnd, result);
                })
                .catch((err) => { });
              if (i == obj.friends.length - 1) {
                resolve(obj);
              }
            }
          }
          // resolve(obj);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  /**
   * Add a new document to a selected database collection
   */

  addInNetwork(addInUserId: string, addToUserId: string): Promise<any> {
    let currentDate = new Date();
    return new Promise((resolve, reject) => {
      this._DB.collection(collections.friends)
        .where("uid", "==", addInUserId)
        .get()
        .then((result) => {
          if (result.docs.length != 0) {
            const doc = result.docs[0];
            const friends = doc.data().friends;
            friends.push({
              uid: addToUserId,
              tiemstamp: currentDate.getTime()
            });
            var docRef = this._DB.collection(collections.friends).doc(doc.id);
            docRef.update({ friends: friends });
          } else {
            let dataObj = {
              uid: addInUserId,
              friends: [
                {
                  uid: addToUserId,
                  tiemstamp: currentDate.getTime()
                }
              ]
            }
            this._DB.collection(collections.friends).add(dataObj);
          }
        })
        .catch((error) => {
        })

      this._DB.collection(collections.friends)
        .where("uid", "==", addToUserId)
        .get()
        .then((result) => {
          if (result.docs.length != 0) {
            const doc = result.docs[0];
            const friends = doc.data().friends;
            friends.push({
              uid: addInUserId,
              tiemstamp: currentDate.getTime()
            });
            var docRef = this._DB.collection(collections.friends).doc(doc.id);
            docRef.update({ friends: friends })
              .then((obj) => {
                resolve(obj);
              })
              .catch((error) => {
                reject(error);
              });
          } else {
            let dataObj = {
              uid: addToUserId,
              friends: [
                {
                  uid: addInUserId,
                  tiemstamp: currentDate.getTime()
                }
              ]
            }
            this._DB.collection(collections.friends).add(dataObj)
              .then((obj: any) => {
                resolve(obj);
              })
              .catch((error: any) => {
                reject(error);
              });
          }
        })
        .catch((error) => {
        })
    });
  }

  /* Admin user Listing */
  getAllUsers(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._DB.collection(collections.users).get()
        .then((querySnapshot) => {
          let obj: any = [];
          if (querySnapshot.docs.length == 0) {
            resolve(obj);
          } else {
            let snapArray = querySnapshot.docs;
            for (let i = 0; i < snapArray.length; i++) {
              let doc = querySnapshot.docs[i];
              obj.push(doc.data());
              if (i == snapArray.length - 1) {
                resolve(obj);
              }
            }
          }
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  /* Admin user Listing */
  getAllSpamReports(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._DB.collection(collections.spamReports).get()
        .then((querySnapshot) => {
          let obj: any = [];
          if (querySnapshot.docs.length == 0) {
            resolve(obj);
          } else {
            let snapArray = querySnapshot.docs;
            for (let i = 0; i < snapArray.length; i++) {
              let doc = querySnapshot.docs[i];

              this.getProfile(doc.data().uid).
                then((result) => {
                  console.log("result",result)
                  obj.push(Object.assign(doc.data(), result));
                  if (i == snapArray.length - 1) {
                    resolve(obj);
                  }
                })
                .catch((err) => { });
              // obj.push(doc.data());
            }
          }
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  /**
   * retrive inbox list
   * 
   */
  inboxList(uid: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this._DB.collection(collections.messaging)
        .where("users." + uid, "==", true)
        .get()
        .then((querySnapshot) => {
          let obj: any = [];
          if (querySnapshot.docs.length == 0) {
            resolve(obj);
          } else {
            let doc = querySnapshot.docs;
            for (let i = 0; i < doc.length; i++) {
              this.getLastMsg(doc[i].id)
                .then((lastmsg) => {
                  if (lastmsg.message) {
                    let users = doc[i].data().users;
                    let senderId = '';
                    if (Object.keys(users)[0] != uid) {
                      senderId = Object.keys(users)[0];
                    } else {
                      senderId = Object.keys(users)[1];
                    }
                    this.getProfile(senderId).
                      then((result) => {
                        result.lastmsg = lastmsg;
                        obj.push(result);
                      })
                      .catch((err) => { });
                  } else { }
                })
                .catch((error) => {
                })
              if (i == doc.length - 1) {
                resolve(obj);
              }
            }
          }
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  /**Retrive last message*/
  getLastMsg(docId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this._DB.collection(collections.messaging).doc(docId).collection(collections.messages)
        .orderBy('sent', "desc")
        .limit(1)
        .get()
        .then((res) => {
          let obj: any = {};
          if (res.docs.length == 0) {
            resolve(obj);
          } else {
            let doc = res.docs[0];
            obj = {
              message: doc.data().message,
              sent: doc.data().sent
            }
            resolve(obj)
          }
        })
        .catch((error) => {
          reject(error);
        })
    })
  }

  /**
   * Add a new document to a selected database collection
   */

  sendMsg(msgFromId: string, msgToId: string, msg: string): Promise<any> {
    let currentDate = new Date();
    return new Promise((resolve, reject) => {
      let msgObj = {
        sender: msgFromId,
        message: msg,
        sent: firebase.firestore.Timestamp.now()
      }
      this._DB.collection(collections.messaging)
        .where("users." + msgFromId, "==", true)
        .where('users.' + msgToId, "==", true)
        .get()
        .then((result) => {
          if (!result.empty) {
            if (msg != '') {
              this.sendNotification(msgToId, msg)
            }
            this._DB.collection(collections.messaging).doc(result.docs[0].id).collection(collections.messages).add(msgObj)
              .then((res) => {
                resolve(res);
              })
              .catch((err) => {
                reject(err);
              })
          } else {
            var users = {};
            users[msgFromId] = true;
            users[msgToId] = true;
            let dataObj = {
              users: users
            }
            this._DB.collection(collections.messaging).add(dataObj).then((docRef) => {
              this._DB.collection(collections.messaging).doc(docRef.id).collection(collections.messages).add(msgObj)
                .then((res) => {
                  resolve({ docId: docRef.id });
                })
                .catch((err) => {
                  reject(err);
                })
            });
          }
        })
        .catch((error) => {
        })
    });
  }

  /**Retrive one to one chat*/
  getChatHistory(fromUid: string, toUid: string) {
    return new Promise((resolve, reject) => {
      return this._DB.collection(collections.messaging)
        .where("users." + fromUid, "==", true)
        .where("users." + toUid, "==", true)
        .get()
        .then((result) => {
          let obj: any = [];
          if (!result.empty) {
            obj.docId = result.docs[0].id;
            this._DB.collection(collections.messaging).doc(obj.docId).collection(collections.messages)
              .orderBy('sent')
              .get()
              .then((res) => {
                if (res.docs.length == 0) {
                  resolve(obj);
                } else {
                  for (let i = 0; i < res.docs.length; i++) {
                    let doc = res.docs[i];
                    obj.push({
                      id: doc.id,
                      message: doc.data().message,
                      sender: doc.data().sender,
                      sent: doc.data().sent,
                    });
                    if (i == res.docs.length - 1) {
                      resolve(obj)
                    }
                  }
                }
              })
              .catch((error) => {
                reject(error);
              })
          } else {
            var users = {};
            users[fromUid] = true;
            users[toUid] = true;
            let dataObj = {
              users: users
            }
            this._DB.collection(collections.messaging).add(dataObj).then((docRef: any) => {
              obj.docId = docRef.id;
              resolve(obj);
            }).catch((error: any) => {
              reject(error);
            });
          }
        })
        .catch((error) => {
          reject(error);
        })
    });
  }
  
  /**
   * send chat notification to destination user
   * @param uid 
   */
  sendNotification(uid: string, msg: string) {
    this._DB.collection(collections.users).where("uid", "==", uid)
      .get()
      .then((result: any) => {
        if (result.docs.length != 0) {
          let doc = result.docs[0];
          let devicetoken = doc.data().devicetoken;
          let devicetype = doc.data().devicetype;
          console.log(doc.data())
          if (devicetoken) {
            if (devicetype != 'browser') {
              // this.httpservice.sendDemoNotification(devicetoken, msg, doc.data().displayName);
            }
          }
        }
      })
      .catch()
  }

}
