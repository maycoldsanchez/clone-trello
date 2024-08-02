import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Dialog } from '@angular/cdk/dialog';
import { TodoDialogComponent } from '@boards/components/todo-dialog/todo-dialog.component';

import { ToDo, Column } from '@models/todo.model';
import { ActivatedRoute } from '@angular/router';
import { BoardService } from '../../../../services/board.service';
import { Board } from '../../../../models/board.model';
import { Card } from '@models/card.model';
import { CardService } from '@services/card.service';
import { faPlus, faClose } from '@fortawesome/free-solid-svg-icons';
import { List } from '@models/list.model';
import { FormControl, Validators } from '@angular/forms';
import { ListService } from '@services/list.service';
import { COLORS } from '@models/colors.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styles: [
    `
      .cdk-drop-list-dragging .cdk-drag {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }
      .cdk-drag-animating {
        transition: transform 300ms cubic-bezier(0, 0, 0.2, 1);
      }
    `,
  ],
})
export class BoardComponent implements OnInit, OnDestroy {
  faPlus = faPlus
  faClose = faClose

  board: Board | null = null;
  showListForm: boolean = false

  inputCard = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required]
  })

  inputList = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required]
  })

  mapColors = COLORS;

  constructor(
    private dialog: Dialog,
    private route: ActivatedRoute,
    private boardService: BoardService,
    private cardService: CardService,
    private listService: ListService
  ) {

  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.getBoards(id);
      }
    })
  }

  drop(event: CdkDragDrop<Card[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    const position = this.boardService.getPosition(event.container.data, event.currentIndex);
    const card = event.container.data[event.currentIndex];
    const listId = event.container.id;
    this.updateCard(card, position, listId);
  }


  openDialog(card: Card) {
    const dialogRef = this.dialog.open(TodoDialogComponent, {
      minWidth: '300px',
      maxWidth: '50%',
      data: {
        card: card,
      },
    });
    dialogRef.closed.subscribe((output) => {
      console.log(output);
    });
  }

  createCard(list: List) {
    const title = this.inputCard.value
    this.cardService.create({
      title,
      listId: list.id,
      boardId: this.board!.id,
      position: this.boardService.getNewPosition(list.cards)
    }).subscribe(card => {
      console.log(card)
      list.cards.push(card);
      this.inputCard.setValue('');
      this.closeAddCard(list)
    });

  }

  createList(board: Board) {
    const title = this.inputList.value
    this.listService.create({
      title,
      boardId: this.board!.id,
      position: this.boardService.getNewPosition(this.board!.lists)
    }).subscribe(list => {
      this.board!.lists.push({ ...list, cards: []});
      this.inputList.setValue('');
      this.showListAdd()
    });
  }

  showListAdd() {
    this.showListForm = !this.showListForm;
  }

  showAddCard(list: List) {
    if (this.board?.lists) {
      this.board.lists = this.board.lists.map((listIter) => ({
        ...listIter,
        showCardForm: listIter.id === list.id,
      }));
    }

  }

  closeAddCard(list: List) {
    list.showCardForm =false
  }

  private getBoards(id: string) {
    this.boardService.getBoard(id).subscribe(board => {
      this.board = board
      this.boardService.setNavBarBackgound(board.backgroundColor)
    })
  }

  private updateCard(card: Card, position: number, listId: string | number) {
    console.log(card)
    this.cardService.update(card.id, { position, listId }).subscribe()
  }

  get bgColors() {
    const colors = this.mapColors['background'][this.board!.backgroundColor];
    if (colors) {
      return colors;
    }
    return {};
  }

  ngOnDestroy() {
    this.boardService.setNavBarBackgound('sky')
  }
}

