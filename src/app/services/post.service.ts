import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  public idPost: any;
  public refPost: any;

  constructor(private angularFireDatabase: AngularFireDatabase) { }

  getPost(user) {
    return this.angularFireDatabase.list('/posts/');
  }

  createPost(post, uid) {
    this.idPost = this.angularFireDatabase.createPushId();
    post.pid = this.idPost;
    return this.angularFireDatabase.object('/posts/' + this.idPost).set(post);
  }

  editPost(post) {
    return this.angularFireDatabase.object('/posts/' + post.id).set(post);
  }

  likePost(likes, pid) {
    return this.angularFireDatabase.object('/posts/' + pid + '/likes/').set(likes);
  }
}
