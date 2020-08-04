import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { PostService } from '../../services/post.service';
import { User } from '../../interfaces/user';
import { Post, Like } from '../../interfaces/post';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Comment } from '../../interfaces/post';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public userData: any;
  public like: Like;
  public uid = '';
  public postData: any;
  public tweetData = {
    flat: false,
    message: ''
  };
  public changeScreen = false;
  public imageChangedEvent: any = '';
  public croppedImage: any = '';
  public picture: any;
  public refPost: any;
  public comment: string;

  constructor(  private userService: UserService,
                private postService: PostService,
                private authenticationService: AuthenticationService,
                private angularFireStorage: AngularFireStorage ) {

    this.authenticationService.getStatus().subscribe((status) => {
      this.userService.getUser(status).valueChanges().subscribe((data: User) => {
        this.uid = data.uid;
        this.userData = [];
        this.userData = data;
      }, (err) => {
        console.log(err);
      });

      this.postService.getPost(status).valueChanges().subscribe((data) => {
        this.postData = [];
        // tslint:disable-next-line: forin
        this.postData = data.map( post => {
          return { ...post, comments: []}
        });
        // Likes comments
        this.postService.getComments().valueChanges().subscribe( comments => {
          this.postData.map( post => {
            post.comments = comments.filter(comment => comment.pid === post.pid )
          });
        });
        this.postData = this.postData.filter( post => post.uid === this.userData.uid);
        console.log(this.postData)
      });

    }, (err) => {
      console.log(err);
    });
  }

   tweet() {
    this.tweetData.flat = !this.tweetData.flat;
   }

   postTweet() {
    const post: Post = {
      message: this.tweetData.message,
      created: new Date(),
      uid: this.userData.uid,
      pid: '',
      likes : {
        uid: this.userData.uid,
        userName: this.userData.name,
        photo: this.userData.photo,
        liked: false
      },
      comments: []
    };

    this.postService.createPost(post, this.userData.uid)
    .then((data) => {
      alert('Posteado Correctamente');
    }).catch((err) => {
      alert('Error al Postear');
      console.log(err);
    });
   }

   editUser() {
    this.changeScreen = !this.changeScreen;
   }

   saveDataUser() {
     if (this.croppedImage) {
      const currentPictureId = Date.now();
      const picture = this.angularFireStorage.ref('pictures/' + currentPictureId + '.jpg').putString(this.croppedImage, 'data_url');
      picture.then(() => {
        this.picture = this.angularFireStorage.ref('pictures' + currentPictureId + '.jpg').getDownloadURL();
        this.picture.subscribe((p) => {
          console.log(p);
          this.userService.setPhotoUser(this.uid, p)
          .then(() => alert('Imagen subida correctamnte'))
          .catch((err) => {
            alert('Error a cargar la imagen');
            console.log(err);
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
     } else {
       this.userService.editUser(this.userData)
       .then(() => {
          alert('Guardado Correctamente');
       }).catch((err) => {
        alert('Error al guardar');
       });
       this.editUser();
     }
   }

   fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
  }
  imageLoaded() {
      // show cropper
  }
  cropperReady() {
      // cropper ready
  }
  loadImageFailed() {
      // show message
  }

  saveLike(post: Post) {
    this.like = {
      liked: post.likes.liked = !post.likes.liked,
      uid: this.userData.uid,
      userName: this.userData.nickname,
      photo: this.userData.photo
    };
    this.postService.likePost(this.like, post.pid);
  }

  saveComment( post: Post) {
    const comment: Comment = {
      cid: '',
      pid: post.pid,
      message: this.comment,
      created: new Date(),
      uid: this.userData.uid,
      likes : []
    };
    this.postService.commentPost(comment);
  }

  ngOnInit(): void {
  }

}
