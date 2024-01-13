export interface SuggestionCommentReplyRequest {
  suggestionId: number;
  suggestionCommentId: number;
  content: string;
  replyingTo: string;
  userId: number;
}
