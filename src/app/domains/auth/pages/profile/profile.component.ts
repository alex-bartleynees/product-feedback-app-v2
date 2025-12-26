import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { UsersFacade } from '@product-feedback-app-v2/core-state';
import { UsersService } from '@product-feedback-app-v2/core-data';
import {
  BackButtonComponent,
  ButtonComponent,
} from '@product-feedback-app-v2/shared';

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

@Component({
  selector: 'product-feedback-app-v2-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [BackButtonComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  private router = inject(Router);
  private usersService = inject(UsersService);
  usersFacade = inject(UsersFacade);

  selectedFile = signal<File | null>(null);
  previewUrl = signal<string | null>(null);
  isUploading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  currentImageUrl = computed(() => {
    const user = this.usersFacade.currentUser();
    return user?.image ?? '';
  });

  onSelectFileClick(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    this.errorMessage.set(null);
    this.successMessage.set(null);

    if (!file) {
      return;
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      this.errorMessage.set('Please select a valid image file (JPEG, PNG, GIF, or WebP).');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      this.errorMessage.set('File size must be less than 5MB.');
      return;
    }

    this.selectedFile.set(file);

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  onUploadClick(): void {
    const file = this.selectedFile();
    const userId = this.usersFacade.currentUser()?.id;

    if (!file || !userId) {
      return;
    }

    this.isUploading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.usersService.uploadProfileImage(userId, file).subscribe({
      next: (result) => {
        this.isUploading.set(false);
        this.usersFacade.updateUserImage(result.url);
        this.successMessage.set('Profile picture updated successfully!');
        this.selectedFile.set(null);
        this.previewUrl.set(null);
        if (this.fileInput) {
          this.fileInput.nativeElement.value = '';
        }
      },
      error: (error: HttpErrorResponse) => {
        this.isUploading.set(false);
        if (error.status === 413) {
          this.errorMessage.set('File size is too large.');
        } else if (error.status === 415) {
          this.errorMessage.set('Unsupported file type.');
        } else {
          this.errorMessage.set('Failed to upload image. Please try again.');
        }
      },
    });
  }

  onCancelPreview(): void {
    this.selectedFile.set(null);
    this.previewUrl.set(null);
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  onBackClick(): void {
    this.router.navigate(['/']);
  }
}
