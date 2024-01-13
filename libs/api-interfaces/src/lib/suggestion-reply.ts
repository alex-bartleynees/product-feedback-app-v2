import { User } from './user';

export interface SuggestionReply {
  id?: number;
  suggestionCommentId: number;
  content: string;
  replyingTo: string;
  user: User;
}
