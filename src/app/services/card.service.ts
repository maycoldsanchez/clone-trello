import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { checkToken } from '../interceptor/token.interceptor';
import { Card, CardDto, CreateCard } from '@models/card.model';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  apiUrl = environment.apiUrl
  constructor(private http: HttpClient) { }

  create(card: CreateCard) {
    return this.http.post<Card>(`${this.apiUrl}/cards`, card, {
      context: checkToken()
    });
  }

  update(id: Card['id'], changes: CardDto) {
    return this.http.put<Card>(`${this.apiUrl}/cards/${id}`, changes, {
      context: checkToken()
    });
  }
}
