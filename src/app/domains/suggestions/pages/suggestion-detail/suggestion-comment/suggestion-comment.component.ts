import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  SuggestionComment,
  User,
  SuggestionReply,
} from '@product-feedback-app-v2/api-interfaces';
import { ButtonComponent, CommentForm } from '@product-feedback-app-v2/shared';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'product-feedback-app-v2-suggestion-comment',
  templateUrl: './suggestion-comment.component.html',
  styleUrls: ['./suggestion-comment.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuggestionCommentComponent {
  @Input() comment?: SuggestionComment;
  @Input() parentComment?: SuggestionComment;
  @Input() replyingTo?: string;
  @Input() currentUser?: User | null;

  @Output() newReply = new EventEmitter<SuggestionReply>();

  commentForm = new CommentForm();
  showReply = false;

  onCommentReply() {
    if (!this.comment?.id || !this.commentForm.valid || !this.currentUser) {
      return;
    }

    const newReply: SuggestionReply = {
      suggestionCommentId: this.parentComment?.id
        ? this.parentComment.id
        : this.comment.id,
      content: this.commentForm.comment.value,
      replyingTo: this.comment?.user.username,
      user: this.currentUser,
    };

    this.newReply.emit(newReply);
  }

  onNewReply(reply: SuggestionReply) {
    this.newReply.emit(reply);
  }
}
