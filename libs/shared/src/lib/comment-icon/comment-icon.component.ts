import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { environment } from 'src/app/environments/environment';

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
  environment = environment;
}
