import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'product-feedback-app-v2-comment-icon',
  templateUrl: './comment-icon.component.html',
  styleUrls: ['./comment-icon.component.scss'],
  imports: [CommonModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentIconComponent {
  @Input() numberOfComments?: number;
}
