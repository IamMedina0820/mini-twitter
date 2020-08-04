import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { Like, Comment, Post } from '../interfaces/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  public idPost: any;
  public refPost: any;

  constructor(private angularFireDatabase: AngularFireDatabase) { }

  getPost(user): AngularFireList<Post> {
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

  likePost(like, pid) {
    return this.angularFireDatabase.object('/posts/' + pid + '/likes/').set(like);
  }

  commentPost(comment) {
    comment.cid = this.angularFireDatabase.createPushId();
    return this.angularFireDatabase.object('/comments/' + comment.cid).set(comment);
  }

  getLikes(): AngularFireList<Like> {
    return this.angularFireDatabase.list('/likes/');
  }

  getComments(): AngularFireList<Comment> {
    return this.angularFireDatabase.list('/comments/');
  }
}
