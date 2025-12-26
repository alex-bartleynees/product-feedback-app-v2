import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  Signal,
  signal,
} from '@angular/core';


import {
  SuggestionComment,
  User,
  SuggestionReply,
} from '@product-feedback-app-v2/api-interfaces';
import {
  ButtonComponent,
  CommentForm,
  ControlErrorContainerDirective,
  ControlErrorsDirective,
  FormSubmitDirective,
} from '@product-feedback-app-v2/shared';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'product-feedback-app-v2-suggestion-comment',
    templateUrl: './suggestion-comment.component.html',
    styleUrls: ['./suggestion-comment.component.scss'],
    imports: [
    ReactiveFormsModule,
    ButtonComponent,
    ControlErrorsDirective,
    FormSubmitDirective,
    ControlErrorContainerDirective
],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SuggestionCommentComponent {
  @Input() comment?: SuggestionComment;
  @Input() parentComment?: SuggestionComment;
  @Input() replyingTo?: string;
  @Input() currentUser?: Signal<User> | null;
  @Input() isAuthenticated = false;

  @Output() newReply = new EventEmitter<SuggestionReply>();

  commentForm = new CommentForm();
  showReply = signal(false);

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
      user: this.currentUser(),
    };

    this.newReply.emit(newReply);
    this.showReply.set(false);
    this.commentForm.comment.reset();
  }

  onNewReply(reply: SuggestionReply) {
    this.newReply.emit(reply);
  }
}
