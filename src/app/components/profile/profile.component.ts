import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { PostService } from '../../services/post.service';
import { User } from '../../interfaces/user';
import { Post } from '../../interfaces/post';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public userData: any;
  public likes: any = {};
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

  constructor(  private userService: UserService,
                private postService: PostService,
                private authenticationService: AuthenticationService,
                private angularFireStorage: AngularFireStorage ) {

    this.likes = {
      like: false,
      uid: '',
      user: '',
      photo: ''
    };

    this.authenticationService.getStatus().subscribe((status) => {
      this.userService.getUser(status).valueChanges().subscribe((data: User) => {
        this.uid = data.uid;
        this.userData = [];
        this.userData = data;
      }, (err) => {
        console.log(err);
      });

      this.postService.getPost(status).valueChanges().subscribe((data) => {
        console.log(data);
        this.postData = [];
        this.refPost = [];
        // tslint:disable-next-line: forin
        for (const key in data) {
          this.refPost.push(key);
          this.postData.push(data[key]);
        }
        console.log(this.postData);
        console.log(this.refPost);
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
      likes: this.likes
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
      const currentPictureId = new Date();
      const picture = this.angularFireStorage.ref('picture/' + currentPictureId + '.jpg').putString(this.croppedImage, 'data_url');
      picture.then((result) => {
        this.picture = this.angularFireStorage.ref('picture' + currentPictureId + '.jpg').getDownloadURL();
        this.picture.subscribe((pict) => {
          this.userService.setPhotoUser(this.uid, pict)
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
     }
     this.userService.editUser(this.userData)
     .then((data) => {
        alert('Guardado Correctamente');
     }).catch((err) => {
      alert('Error al guardar');
     });
     this.editUser();
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

  like(post) {
    console.log(post);
    let validationLike: boolean;
    if (post.likes.like) {
      validationLike = false;
    } else {
      validationLike = true;
    }
    this.likes = {
      like: validationLike,
      uid: this.userData.uid,
      user: this.userData.nickname,
      photo: this.userData.photo
    };
    this.postService.likePost(this.likes, post.pid);
  }

  ngOnInit(): void {
  }

}
