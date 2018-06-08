import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { collections } from '../../config/env-example';

@Injectable()
export class DatabaseProvider {

  private _DB: any;
  constructor(
  ) {
    this._DB = firebase.firestore();
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
          if (querySnapshot.docs.length == 0) {
            resolve(obj);
          } else {
            for (let i = 0; i < querySnapshot.docs.length; i++) {
              let doc = querySnapshot.docs[i];
              // this._DB.collection("users").where("uid", "==", doc.data().userId).get().then((snapres) =>{
              //   if(snapres.docs.length != 0){
              obj.push({
                id: doc.id,
                discussionTitle: doc.data().discussionTitle,
                discussionDesc: doc.data().discussionDesc,
                createdAt: doc.data().createdAt,
                // userInfo: snapres.docs[0].data()
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
   * retrive friend request list
   * 
   */
  friendReqList(uid: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this._DB.collection(collections.friendReq)
        .where("uid", "==", uid)
        // .where("isAccepted", "==", 1)
        .get()
        .then((querySnapshot) => {
          let obj: any = [];
          if (querySnapshot.docs.length == 0) {
            resolve(obj);
          } else {
            let doc = querySnapshot.docs[0];
            let tempobj = doc.data();
            for (let i = 0; i < tempobj.sentBy.length; i++) {
              if (tempobj.sentBy[i].isAccepted == 1) {
                obj = doc.data();
                obj.id = doc.id;
                let req = obj.sentBy[i];
                this.getProfile(req.sentFrom).
                  then((result) => {
                    obj.sentBy[i] = Object.assign(req, result);
                  })
                  .catch((err) => { });
              }
              if (i == tempobj.sentBy.length - 1) {
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

  sendReq(reqFrom: string, reqTo: string): Promise<any> {
    let currentDate = new Date();
    return new Promise((resolve, reject) => {
      this._DB.collection(collections.friendReq)
        .where("uid", "==", reqTo)
        .get()
        .then((result) => {
          if (result.docs.length != 0) {
            const doc = result.docs[0];
            const sentBy = doc.data().sentBy;
            sentBy.push({
              sentFrom: reqFrom,
              isAccepted: 1, //1 for pending, 2 for accepted, 3 for rejected
              tiemstamp: currentDate.getTime()
            });
            var docRef = this._DB.collection(collections.friendReq).doc(doc.id);
            docRef.update({ sentBy: sentBy })
              .then((obj) => {
                resolve(obj);
              })
              .catch((error) => {
                reject(error);
              });
          } else {
            let dataObj = {
              uid: reqTo,
              sentBy: [
                {
                  sentFrom: reqFrom,
                  isAccepted: 1,
                  tiemstamp: currentDate.getTime()
                }
              ]
            }
            this._DB.collection(collections.friendReq).add(dataObj)
              // result.add(dataObj)
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

  /**
   * Accept friend request
   */

  acceptReq(reqFrom: string, reqTo: string, reqArr, docId): Promise<any> {
    let currentDate = new Date();
    return new Promise((resolve, reject) => {
      //adding record in who is accepting request
      this._DB.collection(collections.friends)
        .where("uid", "==", reqTo)
        .get()
        .then((result) => {
          if (result.docs.length != 0) {
            const doc = result.docs[0];
            const friends = doc.data().friends;
            friends.push({
              uid: reqFrom,
              tiemstamp: currentDate.getTime()
            });
            var docRef = this._DB.collection(collections.friends).doc(doc.id);
            docRef.update({ friends: friends })
              .then((obj) => {
                // resolve(obj);
              })
              .catch((error) => {
                // reject(error);
              });
          } else {
            let dataObj = {
              uid: reqTo,
              friends: [
                {
                  uid: reqFrom,
                  tiemstamp: currentDate.getTime()
                }
              ]
            }
            this._DB.collection(collections.friends).add(dataObj)
              .then((obj: any) => {
                // resolve(obj);
              })
              .catch((error: any) => {
                // reject(error);
              });
          }

          /**
           * update friend request isaccepted in friend request collection
           */
          let removeIndex = reqArr.map(function (item) { return item.sentFrom; }).indexOf(reqFrom);
          reqArr.splice(removeIndex, 1);
          this._DB.collection(collections.friendReq).doc(docId)
            .update({ sentBy: reqArr });

        })
        .catch((error) => {
        })

      //adding record in requested user list
      this._DB.collection(collections.friends)
        .where("uid", "==", reqFrom)
        .get()
        .then((result) => {
          if (result.docs.length != 0) {
            const doc = result.docs[0];
            const friends = doc.data().friends;
            friends.push({
              uid: reqTo,
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
              uid: reqFrom,
              friends: [
                {
                  uid: reqTo,
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

  /**
   * Accept friend request
   */

  rejectReq(reqFrom: string, reqArr, docId): Promise<any> {
    return new Promise((resolve, reject) => {
      let removeIndex = reqArr.map(function (item) { return item.sentFrom; }).indexOf(reqFrom);
      reqArr.splice(removeIndex, 1);
      this._DB.collection(collections.friendReq).doc(docId)
        .update({ sentBy: reqArr })
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error)
        });

    });
  }


}
