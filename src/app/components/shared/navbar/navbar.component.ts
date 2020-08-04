import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor( 
                private authenticationService: AuthenticationService,
                private router: Router
              ) { }

  ngOnInit(): void {
  }

  logOut() {
    this.authenticationService.logOut()
    .then(() => {
      this.router.navigate(['login']);
    }).catch((err) => {
      alert('Error al cerrar sesión');
      console.log(err);
    });
  }

}
