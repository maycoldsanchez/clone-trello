import { Component, OnInit } from '@angular/core';
import { faBox, faWaveSquare, faClock, faAngleUp, faAngleDown, faHeart, faBorderAll, faUsers, faGear } from '@fortawesome/free-solid-svg-icons';
import { faTrello } from '@fortawesome/free-brands-svg-icons';
import { MeService } from '@services/me.service';
import { Board } from '@models/board.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html'
})
export class BoardsComponent implements OnInit {

  faTrello = faTrello;
  faBox = faBox;
  faWaveSquare = faWaveSquare;
  faClock = faClock;
  faAngleUp = faAngleUp;
  faAngleDown = faAngleDown;
  faHeart = faHeart;
  faBorderAll = faBorderAll;
  faUsers = faUsers;
  faGear = faGear;

  boards: Board[] = []

  constructor(private meService: MeService) { }

  ngOnInit() {
    this.getMeBoards();
  }

  getMeBoards() {
    this.meService.getMeBoards().subscribe((boards: Board[]) => {
        this.boards = boards;
    })
  }

}
