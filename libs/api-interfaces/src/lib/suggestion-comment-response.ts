import { User } from './user';

export interface SuggestionCommentResponse {
  id: number;
  suggestionId: number;
  content: string;
  user: User;
}
