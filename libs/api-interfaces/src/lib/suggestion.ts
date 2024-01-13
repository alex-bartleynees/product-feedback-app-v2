import { SuggestionComment } from './suggestion-comment';

export interface Suggestion {
  id?: number;
  title: string;
  category: string;
  upvotes: number;
  status: string;
  description: string;
  comments?: SuggestionComment[];
}
