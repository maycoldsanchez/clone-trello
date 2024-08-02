import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { User } from '@models/user.model';
import { checkToken } from '../interceptor/token.interceptor';
import { Board } from '@models/board.model';
import { Card } from '@models/card.model';
import { Colors } from '@models/colors.model';
import { List } from '@models/list.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  bufferSpace = 65535;
  apiUrl = environment.apiUrl
  constructor(private http: HttpClient, private tokenService: TokenService) { }
  navBarBackgroundColor$ = new BehaviorSubject<Colors>('sky')

  getBoard(id: Board['id']) {
    return this.http.get<Board>(`${this.apiUrl}/boards/${id}`, {
      context: checkToken()
    });
  }

   getPosition(cards: Card[], currentIndex: number) {
    if (cards.length === 1) {
      return this.bufferSpace;
    }
    if (cards.length > 1 && currentIndex === 0) {
      const onTopPosition = cards[1].position;
      return onTopPosition / 2;
    }
    const lastIndex = cards.length - 1;
    if (cards.length > 2 && currentIndex > 0 && currentIndex < lastIndex) {
      const prevPosition = cards[currentIndex - 1].position;
      const nextPosition = cards[currentIndex + 1].position;
      return (prevPosition + nextPosition) / 2;
    }
    if (cards.length > 1 && currentIndex === lastIndex) {
      const onBottomPosition = cards[lastIndex - 1].position;
      return onBottomPosition + this.bufferSpace;
    }
    return 0;
   }

  getNewPosition(elements: Card[] | List[]) {
    if (elements.length === 0) {
      return this.bufferSpace;
    }
    const lastIndex = elements.length - 1;
    const onBottomPosition = elements[lastIndex].position;
    return onBottomPosition + this.bufferSpace;
   }

  createBoard(title: Board['title'], backgroundColor: Colors) {
    return this.http.post<Board>(`${this.apiUrl}/boards`, {
      title,
      backgroundColor
    }, {
      context: checkToken()
    });
  }

  setNavBarBackgound(color: Colors) {
    this.navBarBackgroundColor$.next(color);
  }
}
