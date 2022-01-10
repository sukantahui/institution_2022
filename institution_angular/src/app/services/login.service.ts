import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { User } from '../models/user.model';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';


export interface AuthResponseData {
  success: number;
  data: {
    user: User ;
    token: string;
  };
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private BASE_API_URL = environment.BASE_API_URL;
  // userBehaviorSubject = new BehaviorSubject<User>(any);




  constructor(private http: HttpClient) { }

  login(loginData: {loginId: string, loginPassword: string}){
    return this.http.post<AuthResponseData>(this.BASE_API_URL + '/login', loginData)
      .pipe(catchError(this.serverError), tap(resData => {
        // tslint:disable-next-line:max-line-length
        if (resData.success === 1){
            const user = new User(resData.data.user.uniqueId,
              resData.data.user.userName,
              resData.data.user.userTypeId,
              resData.data.user.userTypeName);
            const token = resData.data.token;
            // this.userBehaviorSubject.next(user);
            localStorage.setItem('user', JSON.stringify(user));
          }
      }));  // this.handleError is a method created by me
  }

  private serverError(err: any) {
    if (err instanceof Response) {
      return throwError('backend server error');
      // if you're using lite-server, use the following line
      // instead of the line above:
      // return Observable.throw(err.text() || 'backend server error');
    }
    if (err.status === 0){
      // tslint:disable-next-line:label-position
      return throwError ({status: err.status, message: 'Backend Server is not Working', statusText: err.statusText});
    }
    if (err.status === 401){
      // tslint:disable-next-line:label-position
      return throwError ({status: err.status, message: 'Your are not authorised', statusText: err.statusText});
    }
    return throwError(err);
  }
}
