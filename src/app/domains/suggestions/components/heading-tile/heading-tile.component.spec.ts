import { APP_CONFIG } from '@product-feedback-app-v2/app-config';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadingTileComponent } from './heading-tile.component';

describe('HeadingTileComponent', () => {
  let component: HeadingTileComponent;
  let fixture: ComponentFixture<HeadingTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeadingTileComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadingTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
