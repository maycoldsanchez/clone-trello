import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  faBell,
  faInfoCircle,
  faClose,
  faAngleDown
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '@services/auth.service';
import { BoardService } from '../../../../services/board.service';
import { COLORS, Colors } from '@models/colors.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  faBell = faBell;
  faInfoCircle = faInfoCircle;
  faClose = faClose;
  faAngleDown = faAngleDown;

  isOpenOverlayAvatar = false;
  isOpenOverlayBoards = false;
  isOpenOverlayCreateBoards = false;
  user$ = this.authService.user$;
  navBarBackgournd: Colors = 'sky'
  mapColors = COLORS;

  constructor(
    private authService: AuthService,
    private router: Router,
    private boardService: BoardService
  ) {
    this.boardService.navBarBackgroundColor$.subscribe(color => {
      this.navBarBackgournd = color;
    })
  }

  logout() {
    console.log('logout')
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  closeOverlayCreate(event: boolean) {
    this.isOpenOverlayCreateBoards = event
  }

  get bgColors() {
    const colors = this.mapColors['navbar'][this.navBarBackgournd];
    if (colors) {
      return colors;
    }
    return {};
  }
}
