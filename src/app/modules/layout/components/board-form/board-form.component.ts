import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { BoardService } from '../../../../services/board.service';
import { Colors } from '@models/colors.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-board-form',
  templateUrl: './board-form.component.html'
})
export class BoardFormComponent {
  faCheck = faCheck
  form = this.formBuilder.nonNullable.group({
    title: ['', Validators.required],
    backgroundColor: new FormControl<Colors>('sky', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });
  status: string = 'init';

  @Output() closeOverlay = new EventEmitter<boolean>();

  constructor(
    private formBuilder: FormBuilder,
    private boardService: BoardService,
    private router: Router) {
  }

  doCreate() {
    if (this.form.valid) {
      const { title, backgroundColor } = this.form.getRawValue();
      this.boardService.createBoard(title, backgroundColor).subscribe(board => {
        this.closeOverlay.next(false);
        this.router.navigate(['/app/boards/', board.id]);
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

}
