import { APP_CONFIG } from '@product-feedback-app-v2/app-config';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoadMapComponent } from './road-map.component';

describe('RoadMapComponent', () => {
  let component: RoadMapComponent;
  let fixture: ComponentFixture<RoadMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoadMapComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: APP_CONFIG, useValue: { apiEndpoint: 'http://test' } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoadMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
