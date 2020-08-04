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

  createUser(user) {
    return this.angularFireDatabase.object('/user/' + user.uid).set(user);
  }

  editUser(user) {
    return this.angularFireDatabase.object('/user/' + user.uid).update(user);
  }

  setPhotoUser(uid, photo) {
    return this.angularFireDatabase.object('/user/' + uid + '/photo/').update(photo);
  }

}
