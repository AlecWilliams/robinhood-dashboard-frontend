import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { LoginRequestPayload } from './login-request.payload';
import { LoginResponsePayload } from './login-response.payload';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  @Output() loggedIn: EventEmitter<boolean> = new EventEmitter();

  constructor(private httpClient: HttpClient, private localStorage: LocalStorageService) { }

  APIUrl = 'http://127.0.0.1:8000/rh/';

  login(loginRequestPayload: LoginRequestPayload) : Observable<any>
  {
    
    return this.httpClient.post<LoginResponsePayload>('http://127.0.0.1:8000/rh/login/', loginRequestPayload).pipe(
      map(data => {
        //If user token stored, already logged in - no need for token cerification
        if(data.access_token)
        {
          this.localStorage.store('authenticationToken', data.access_token);
          this.localStorage.store('refreshToken', data.refresh_token);
          this.localStorage.store('expiresAt', data.expires_in);
          this.loggedIn.emit(true);
        }

        return data;
    }),
      catchError(this.errorHandler)
    ); 
  }

  verify(token: string, challenge_id: string, payload: any): Observable<any>
  {
    return this.httpClient.post<LoginResponsePayload>('http://127.0.0.1:8000/rh/login/token/', 
    {'token': token, 'challenge_id': challenge_id, 'payload': payload}).pipe(map(data => {
         
      this.localStorage.store('authenticationToken', data.access_token);
      this.localStorage.store('refreshToken', data.refresh_token);
      this.localStorage.store('expiresAt', data.expires_in);

      this.loggedIn.emit(true);
      return data;
    })
    );
  }

  errorHandler(error: HttpErrorResponse) 
  {
    let errorMessage = '';
    return throwError(errorMessage);
  }

  logout() : Observable<any>
  {
    this.localStorage.clear('authenticationToken');
    this.localStorage.clear('refreshToken');
    this.localStorage.clear('expiresAt');

    return this.httpClient.get('http://127.0.0.1:8000/rh/logout/');
  }

  getProfileInformation(): Observable<any>
  {
    return this.httpClient.get(this.APIUrl + 'login/profile/');
  }

  getInvestmentProfileInformation(): Observable<any>
  {
    return this.httpClient.get(this.APIUrl + 'login/investment_profile/');
  }

  getPortfolioInformation(): Observable<any>
  {
    return this.httpClient.get(this.APIUrl + 'login/portfolio_profile/');
  }


  getPortfolioHistoricals(): Observable<any>
  {
    return this.httpClient.get(this.APIUrl + 'login/get_historical_portfolio/');
  }

  getPortfolioHistoricalsVariable(span: string): Observable<any>
  {
    return this.httpClient.post(this.APIUrl + 'login/get_user_historicals_variable/', {"span": span});
  }

  getUserHoldings(): Observable<any>
  {
    return this.httpClient.get(this.APIUrl + 'get_user_holdings/');
  }

  getAccessToken()
  {
    return this.localStorage.retrieve('authenticationToken');
  }
  isLoggedIn()
  {
    return this.getAccessToken() != null;
  }


  testChallenge()
  {
    this.httpClient.post('https://api.robinhood.com/challenge/8690c796-7049-4b55-98db-8bcbf54c3552/respond/', {"response": "532585"}).subscribe(data => {
      console.log(data);
  });
  }
}
