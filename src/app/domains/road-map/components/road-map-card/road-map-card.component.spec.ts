import { APP_CONFIG } from '@product-feedback-app-v2/app-config';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoadMapCardComponent } from './road-map-card.component';

describe('RoadMapCardComponent', () => {
  let component: RoadMapCardComponent;
  let fixture: ComponentFixture<RoadMapCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoadMapCardComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: APP_CONFIG, useValue: { apiEndpoint: 'http://test' } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoadMapCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
