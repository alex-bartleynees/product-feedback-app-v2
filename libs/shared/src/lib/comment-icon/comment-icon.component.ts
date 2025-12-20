
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'product-feedback-app-v2-comment-icon',
    templateUrl: './comment-icon.component.html',
    styleUrls: ['./comment-icon.component.scss'],
    imports: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentIconComponent {
  @Input() numberOfComments?: number;
}
