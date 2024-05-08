import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Comment } from 'src/app/classes/comment';
import { CommentsService } from 'src/app/services/comments.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-comment-box',
  templateUrl: './comment-box.component.html',
  styleUrl: './comment-box.component.scss'
})
export class CommentBoxComponent {
  @Input('comment') comment!: Comment;
  @Input('can-delete') auth!: boolean;
  @Output() commentDeleted = new EventEmitter<number>();

  constructor(private sComments: CommentsService, private toastService: ToastService) { }

  deleteComment(id: number | null) {
    if (id) {
      const confirmed = confirm('Seguro desea borrar este comentario?');

      if (confirmed) {
        this.sComments.deleteComment(id).then(() => {
          this.commentDeleted.emit(id);
          this.toastService.showSuccessToast("Exito!", "Comentario eliminado.");
        })
      }
    }
  }
}
