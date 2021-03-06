import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SignpostApi } from '../api/signpost-api.service';
import { UserCreds, User, UserSettings } from '../../users/user.model';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// TODO: CREATE OBJECTS FOR THE RESPONSES ONCE THEYRE DIALED IN
class CreateUserResponse {
  eat: string;
  username: string;
  role: string;
}

class UserByIdResponse {
  username:  string;
  email:     string;
  role:      string;
  confirmed: boolean;
};


@Injectable()

export class ApiUsersService {
  constructor(private http:        Http,
              private signpostApi: SignpostApi) {}

  // Create a new User Account
  createUser(creds: UserCreds): Observable<any> {
    const createUserUrl = this.signpostApi.routes.createUser;
    console.log("DATA TO SEND IS: ", JSON.stringify(creds));
    return this.http
               .post(createUserUrl, JSON.stringify(creds))
               .map( user =>  {
                 console.log("RESPONSE FROM USER CREATION IS: ", user.json());
                 return user.json();
               })
               .catch( (error: Response) => {
                 return Observable.throw(error);
                 // show error message to user
                 // Maybe use remote logging infrastructure
               });
  }

  confirmUser(token: string, email: string): Observable<any> {
    const confirmUserUrl = this.signpostApi.buildUrl('confirmUser', [{':confirmationtoken': token}, {':email': email}]);
    return this.http
               .get(confirmUserUrl)
               .map( success => {
                 console.log("SUCCESS FROM CONFIRM USER IS: ", success);
                 return success.json();
               })
               .catch( (error: Response) => {
                 return Observable.throw(error);
               });
  }

  resendUserConfirmation(userId: string): Observable<any> {
    const confirmationResendUrl = this.signpostApi.buildUrl('resendUserConfirmation', [ {':userId': userId} ]);
    const options = this.signpostApi.getRequestOptionWithEatHeader();
    return this.http
               .get(confirmationResendUrl, options)
               .map( success => {
                 console.log("SUCCESS FROM RESEND CONFIRMATION IS: ", success);
                 return success.json();
               })
               .catch( (error: Response) => {
                 return Observable.throw(error);
               });
  }

  getUserById(usernameOrId: string): Observable<any> {
    const getUserUrl = this.signpostApi.buildUrl('getUserById', [ {':usernameOrId': usernameOrId} ] );
    const options    = this.signpostApi.getRequestOptionWithEatHeader();

    console.log("HEADERS IS: ", options);
    return this.http
               .get(getUserUrl, options)
               .map( user => {
                 console.log("RESPONSE FROM GET USER BY ID IS: ", user.json());
                 return user.json() as UserByIdResponse;
               })
               .catch( (error: Response) => {
                 return Observable.throw(error);
               });
  }

  getUsernameByUserId(userId: string): Observable<any> {
    const getUsernameUrl = this.signpostApi.buildUrl('getUsernameByUserId', [ {':id': userId} ] );
    return this.http
               .get(getUsernameUrl)
               .map( username => {
                 console.log("RESPONSE FROM GET USERNAME IS: ", username.json());
                 return username.json();
               })
               .catch( (error: Response) => {
                 return Observable.throw(error);
               });
  }

  // UPDATE THIS TO RETURN THE NEW USER????
  updateUser(userSettings: UserSettings): Observable<any> {
    const userUpdateUrl = this.signpostApi.buildUrl('updateUser', [{':id': userSettings.userId}]);
    const options = this.signpostApi.getRequestOptionWithEatHeader();

    console.log("USER UPDATE URL IS: ", userUpdateUrl);
    return this.http
               .patch(userUpdateUrl, JSON.stringify({userSettings: userSettings}), options)
               .map( success => {
                 console.log("RESPONSE FROM UPDATE USER IN OBSERVABLE");
                 return success.json();
               })
               .catch( (error: Response) => {
                 return Observable.throw(error);
               });
  }

  checkAvailableValues(username: string = '', email: string = '') {
    const getAvailabilityUrl = this.signpostApi.buildUrl('checkAvailability', [{':username': username}, {':email': email}]);
    const options = this.signpostApi.getRequestOptionWithEatHeader();

    console.log("URL FOR CHECKING AVAILABILITY IS: ", getAvailabilityUrl);
    return this.http
               .get(getAvailabilityUrl, options)
               .map( availability => {
                 console.log("RESPONSE FROM GET AVAILABILITY IS: ", availability);
                 return availability.json();
               })
               .catch( (error: Response) => {
                 return Observable.throw(error);
               });
  }
}
