import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { TokenService } from './token.service';
import { ResponseLogin } from '@models/auth.model';
import { User } from '@models/user.model';
import { checkToken } from '../interceptor/token.interceptor';
@Injectable({
  providedIn: 'root'
})


export class AuthService {

  apiUrl = environment.apiUrl
  user$ = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  login(email: string, password: string) {
    return this.http.post<ResponseLogin>(`${this.apiUrl}/auth/login`, {
      email, password
    }).pipe(
      tap(response => {
        this.tokenService.saveToken(response.access_token)
        this.tokenService.saveRefreshToken(response.refresh_token)
      })
    );
  }

  refreshToken(refreshToken: string) {
     return this.http.post<ResponseLogin>(`${this.apiUrl}/auth/refresh-token`, {
      refreshToken
     }).pipe(
       tap(response => {
        this.tokenService.saveToken(response.access_token)
        this.tokenService.saveRefreshToken(response.refresh_token)
      })
     );
  }

  profile() {
    return this.http.get<User>(`${this.apiUrl}/auth/profile`, {
      context: checkToken()
    }).pipe(
      tap(response => {
        this.user$.next(response)
      })
    );
  }

  register(name: string, email: string, password: string) {
    return this.http.post(`${this.apiUrl}/auth/register`, {
      name, email, password
    });
  }

  registerAndLogin(name: string, email: string, password: string) {
    return this.http.post(`${this.apiUrl}/auth/register`, {
      name, email, password
    }).pipe(
      switchMap(() => this.login(email, password))
    )
  }

  userAvailable(email: string) {
    return this.http.post(`${this.apiUrl}/auth/is-available`, {
      email
    });
  }

  recovery(email: string) {
    return this.http.post(`${this.apiUrl}/auth/recovery`, {
      email
    });
  }

  changePassword(token: string, newPassword: string) {
    return this.http.post(`${this.apiUrl}/auth/change-password`, {
      token, newPassword
    });
  }

  logout() {
    this.tokenService.removeToken();
    this.tokenService.removeRefreshToken();
  }
}
