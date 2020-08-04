import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public changeScreen = '';
  public userData: any;
  constructor(
              private authenticationService: AuthenticationService,
              private userService: UserService,
              private router: Router
              ) 
{ 
  this.userData = {
    name: '',
    lastname: '',
    born: new Date(),
    nickname: '',
    email: '',
    password: '',
    city: '',
    country: '',
    webpage: '',
    joined: new Date(),
    description: '',
    uid: '',
    photo: ''
  }

}

  ngOnInit(): void {}

  getChange(type: string) {
    if (type === 'signIn') {
      this.changeScreen = 'signIn';
    } else if (type === 'signUp') {
      this.changeScreen = 'signUp';
    }
  }

  login() {
    this.authenticationService.loginWithEmail(this.userData.email, this.userData.password)
    .then((data) => {
      alert('Logueado Correctamente');
      this.router.navigate(['profile']);
      console.log(data);
    }).catch((err) => {
      alert('Error al loguearse');
      console.log(err);
    });
  }

  register() {
    this.authenticationService.registerWithEmail(this.userData.email, this.userData.password)
    .then((data) => {
      console.log(data);
      this.userData.uid = data.user.uid;
      this.userService.createUser(this.userData)
      .then(() => {
        alert('Registrado Correctamente');
        this.router.navigate(['profile']);
      }).catch((err) => {
        alert('Error al crear');
      });
    }).catch((err) => {
      alert('Error al registrarse');
      console.log(err);
    });
  }

}
