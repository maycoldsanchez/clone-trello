import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { User } from '@models/user.model';
import { checkToken } from '../interceptor/token.interceptor';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  apiUrl = environment.apiUrl
  constructor(private http: HttpClient, private tokenService: TokenService) { }

  getUsers() {
    return this.http.get<User[]>(`${this.apiUrl}/users`, {
      context: checkToken()
    });
  }
}
