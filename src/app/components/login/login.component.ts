import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@services/authentication.service';
import { UserService } from '@services/user.service';
import { Router } from '@angular/router';
import { User } from '@interfaces/user';
import { FormBuilder, FormGroup, Validators, FormControl, FormControlName } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public formGroup: FormGroup;
  public changeScreen = false;
  public alerts = {
    errors: false,
    success: false
  };

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  addFields() {
    this.getChangeScreen();
    this.formGroup.addControl('name', new FormControl('', [Validators.required, Validators.email]));
    this.formGroup.addControl('lastname', new FormControl('', Validators.required));
    this.formGroup.addControl('nickname', new FormControl('', Validators.required));
  }

  subtractFields(){
    this.getChangeScreen();
    this.formGroup.removeControl('name');
    this.formGroup.removeControl('lastname');
    this.formGroup.removeControl('nickname');
  }

  getChangeScreen() {
    this.changeScreen = !this.changeScreen;
  }

  login() {
    const controls = this.formGroup.controls;
    this.authenticationService.loginWithEmail(controls.email.value, controls.password.value)
    .then((data) => {
      this.alerts.success = true;
      setTimeout(() => {
        this.router.navigate(['profile']);
      }, 3000);
      console.log(data);
    }).catch((err) => {
      this.alerts.errors = true;
      setTimeout(() => {
        this.alerts.errors = false;
      }, 3000);
      console.log(err);
    });
  }

  register() {
    const controls = this.formGroup.controls;
    this.authenticationService.registerWithEmail(controls.email.value, controls.password.value)
    .then((data) => {
      console.log(data);
      const uid = data.user.uid;
      this.userService.createUser(controls, uid)
      .then(() => {
        setTimeout(() => {
          this.router.navigate(['profile']);
        }, 3000);
      }).catch((err) => {
        this.alerts.errors = true;
        setTimeout(() => {
          this.alerts.errors = false;
        }, 3000);
      });
    }).catch((err) => {
      this.alerts.errors = true;
      setTimeout(() => {
        this.alerts.errors = false;
      }, 3000);
      console.log(err);
    });
  }

  validateInput(formControl) {
    let validation = false;
    const control = this.formGroup.get(formControl);
    if (!control.valid && control.touched) {
      return validation = true;
    }
  }

}
