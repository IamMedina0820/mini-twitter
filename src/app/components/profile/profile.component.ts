import { Component, OnInit } from '@angular/core';
import { UserService } from '@services/user.service';
import { AuthenticationService } from '@services/authentication.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { PostService } from '@services/post.service';
import { User } from '@interfaces/user';
import { Post, Like } from '@interfaces/post';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Comment } from '@interfaces/post';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public formGroup: FormGroup;
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

  constructor(
    private userService: UserService,
    private postService: PostService,
    private authenticationService: AuthenticationService,
    private angularFireStorage: AngularFireStorage,
    private formBuilder: FormBuilder) {

    this.authenticationService.getStatus().subscribe((status) => {
      this.userService.getUser(status).valueChanges().subscribe((data: User) => {
        this.uid = data.uid;
        this.userData = [];
        this.userData = data;
        console.log(this.userData);
      }, (err) => {
        console.log(err);
      });

      this.postService.getPost(status).valueChanges().subscribe((data) => {
        this.postData = [];
        // tslint:disable-next-line: forin
        this.postData = data.map( post => {
          return { ...post, comments: []};
        });

        // Likes comments
        this.postService.getComments().valueChanges().subscribe( comments => {
          this.postData.map( post => {
            post.comments = comments.filter(comment => comment.pid === post.pid);
          });
        });
        this.postData = this.postData.filter( post => post.uid === this.userData.uid);
        console.log(this.postData);
      });

    }, (err) => {
      console.log(err);
    });

  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      born: ['', [Validators.required]],
      nickname: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
      webpage: [''],
      email: ['', [Validators.required, Validators.email]],
      description: ['']
    });
    console.log(this.formGroup);
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
    .then(() => {
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
      const picture = this.angularFireStorage.ref('pictures/' + this.userData.uid + '.jpg').putString(this.croppedImage, 'data_url');
      picture.then(() => {
        this.picture = this.angularFireStorage.ref(this.userData.uid + '.jpg').getDownloadURL();
        console.log(this.picture);
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
       const uid = '';
       this.userService.editUser(this.userData, uid)
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

  validateInput(formControl){
    let validation = false;
    const control = this.formGroup.get(formControl);
    if (!control.valid && control.touched) {
      return validation = true;
    }
  }

}
