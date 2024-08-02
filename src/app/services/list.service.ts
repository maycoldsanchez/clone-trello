import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { checkToken } from '../interceptor/token.interceptor';
import { CreateList, List } from '@models/list.model';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  apiUrl = environment.apiUrl
  constructor(private http: HttpClient) { }

  create(list: CreateList) {
    return this.http.post<List>(`${this.apiUrl}/lists`, list, {
      context: checkToken()
    });
  }
}
