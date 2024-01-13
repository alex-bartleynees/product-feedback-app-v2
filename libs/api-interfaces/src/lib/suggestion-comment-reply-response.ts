import { User } from './user';

export interface SuggestionCommentReplyResponse {
  id: number;
  suggestionId: number
  suggestionCommentId: number;
  content: string;
  replyingTo: string
  user: User;
}
