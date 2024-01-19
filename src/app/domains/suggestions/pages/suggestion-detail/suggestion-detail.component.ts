import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Suggestion,
  SuggestionCommentRequest,
  SuggestionReply,
  User,
} from '@product-feedback-app-v2/api-interfaces';
import {
  SuggestionsFacadeService,
  UsersFacade,
} from '@product-feedback-app-v2/core-state';
import {
  BackButtonComponent,
  ButtonComponent,
  CommentForm,
} from '@product-feedback-app-v2/shared';
import { SuggestionListItemComponent } from '../../components/suggestion-list-item/suggestion-list-item.component';
import { SuggestionCommentComponent } from './suggestion-comment/suggestion-comment.component';

@Component({
  selector: 'product-feedback-app-v2-suggestion-detail',
  templateUrl: './suggestion-detail.component.html',
  styleUrls: ['./suggestion-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BackButtonComponent,
    ButtonComponent,
    SuggestionListItemComponent,
    SuggestionCommentComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuggestionDetailComponent implements OnInit {
  selectedSuggestion = this.suggestionsFacade.selectedSuggestion;
  commentForm = new CommentForm();
  currentUser: User = this.usersFacade.currentUser();

  constructor(
    private suggestionsFacade: SuggestionsFacadeService,
    private route: ActivatedRoute,
    private router: Router,
    private usersFacade: UsersFacade
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.suggestionsFacade.selectSuggestion(+id);
    }
  }

  onBackButtonClick() {
    this.router.navigate(['/']);
  }

  onUpVoteClick(suggestion: Suggestion): void {
    this.suggestionsFacade.upVoteSuggestion(suggestion);
  }

  onSubmitComment(): void {
    if (!this.selectedSuggestion || !this.commentForm.valid) {
      return;
    }
    const comment: SuggestionCommentRequest = {
      suggestionId: this.selectedSuggestion()?.id,
      content: this.commentForm.comment.value,
      userId: 1,
    };

    this.suggestionsFacade.addCommentToSuggestion(comment);
    this.commentForm.comment.setValue('');
  }

  onNewReply(reply: SuggestionReply): void {
    if (
      !this.selectedSuggestion()?.id ||
      !reply.user.id ||
      !this.currentUser.id
    ) {
      return;
    }

    // const suggestionReplyRequest: SuggestionCommentReplyRequest = {
    //   suggestionId: this.selectedSuggestion()?.id ?? 0,
    //   suggestionCommentId: reply.suggestionCommentId,
    //   content: reply.content,
    //   replyingTo: reply.replyingTo,
    //   userId: this.currentUser.id,
    // };

    // this.suggestionsFacade.addReplyToComment(suggestionReplyRequest);
  }

  onEditFeedbackClick(): void {
    this.router.navigate(['/suggestion', this.selectedSuggestion()?.id]);
  }
}
