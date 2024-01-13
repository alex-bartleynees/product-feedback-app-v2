import { SuggestionReply } from './suggestion-reply';
import { User } from './user';

export interface SuggestionComment {
  id?: number;
  suggestionId?: number;
  content: string;
  user: User;
  replies?: SuggestionReply[];
}
