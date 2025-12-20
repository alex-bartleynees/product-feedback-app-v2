import { APP_CONFIG } from '@product-feedback-app-v2/app-config';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileSidebarComponent } from './mobile-sidebar.component';

describe('MobileSidebarComponent', () => {
  let component: MobileSidebarComponent;
  let fixture: ComponentFixture<MobileSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileSidebarComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideNoopAnimations(),
        { provide: APP_CONFIG, useValue: { apiEndpoint: 'http://test' } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
