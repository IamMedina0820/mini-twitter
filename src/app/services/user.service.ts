import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private angularFireDatabase: AngularFireDatabase) { }

  getUser(user) {
    return this.angularFireDatabase.object('/user/' + user.uid);
  }

  createUser(user, uid) {
    console.log(user);
    return this.angularFireDatabase.object('/user/' + uid).set(user);
  }

  editUser(user, uid) {
    return this.angularFireDatabase.object('/user/' + uid).update(user);
  }

  setPhotoUser(uid, photo) {
    console.log(photo);
    return this.angularFireDatabase.object('/user/' + uid + '/photo/').set(photo);
  }

}
