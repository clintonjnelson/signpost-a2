import { Component, OnDestroy } from '@angular/core';
// import { trigger, state, style, animate, transition } from '@angular/animations';
import { HelpersService } from '../../shared/helpers/helpers.service';
import { AuthService, UserAuth } from '../../core/auth/auth.service';
import { Subscription } from 'rxjs/Subscription';

export class OauthLink {
  icon: string;
  url:  string;
  bgColor: string;
}

const OAUTHS: OauthLink[] = [
  {icon: 'facebook-official', url: 'http://localhost:3000/styleguide', bgColor: '#3b5998'},
  {icon: 'instagram', url: 'http://localhost:3000/styleguide', bgColor: '#9b6954'},
  {icon: 'linkedin', url: 'http://localhost:3000/styleguide', bgColor: '#007bb5'},
]


@Component({
  moduleId: module.id,
  selector: 'signpost-navbar',
  templateUrl: 'navbar.component.html',  // trigger: [@visibilityChanged]='showLoginLinks'
  styleUrls:  ['navbar.component.css'],
  // animations: [trigger('visibilityChanged', [
  //               state('false', style({opacity: 0, transform: 'translateX(0)'})),
  //               state('true',  style({opacity: 1, transform: 'translateX(0)'})),
  //               transition('false => true', [style({opacity: 0, transform: 'translateX(100px)' }), animate('2000ms')]),  // between wildcard states
  //               transition('true => false', [animate('2000ms', style({opacity: 0, transform: 'translateX(-100px)'}))])  // between wildcard states
  //               ])
  // ]
})

export class NavbarComponent {
  oauthLinks = OAUTHS;
  showLoginLinks:        boolean = false;
  showSignpostLoginForm: boolean = false;
  showUserNavLinks:      boolean = false;
  auth: UserAuth;
  isLoggedIn: boolean = false;
  isLoggedOut: boolean = true;
  username: string = '';
  _subscription: Subscription;

  constructor(
    private helpers: HelpersService,
    public  authService:    AuthService ) {
    this.auth          = authService.auth;
    this._subscription = authService.userAuthEmit.subscribe((newVal: UserAuth) => { this.auth = newVal });
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  //Logged OUT Helpers
  toggleShowSignpostLoginForm(input: any = null): void {
    // If setting value directly, do that.
    if(typeof(input) === 'boolean') {
      this.showSignpostLoginForm = input;
    }
    // Else, just toggle the value
    else {
      this.showSignpostLoginForm = !this.showSignpostLoginForm;
    }
  }

  toggleShowLoginLinks(input: any = null): void {
    // If setting value directly, do that.
    if(typeof(input) === 'boolean') {
      this.showLoginLinks = input;
    }
    // Else, just toggle the value
    else {
      this.showLoginLinks = !this.showLoginLinks;
    }
    if(this.showSignpostLoginForm) {
      this.toggleShowSignpostLoginForm(false);
    }
  }

  onCloseLogin(event: any) {
    this.toggleShowSignpostLoginForm();
  }

  // Logged IN Helpers
  toggleShowUserNavLinks(input: any = null) {
    // If setting value directly, do that.
    if(typeof(input) === 'boolean') {
      this.showUserNavLinks = input;
    }
    // Else, just toggle the value
    else {
    this.showUserNavLinks = !this.showUserNavLinks
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
