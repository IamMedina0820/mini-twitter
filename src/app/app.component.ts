import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mini-twitter';
  public validationUrl: any;

  constructor(private activedRoute: ActivatedRoute) {
    this.validationUrl = this.activedRoute.snapshot.params;
    console.log();
  }

}
