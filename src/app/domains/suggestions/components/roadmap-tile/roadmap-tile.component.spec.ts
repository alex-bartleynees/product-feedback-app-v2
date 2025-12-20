import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { APP_CONFIG } from '@product-feedback-app-v2/app-config';
import { SuggestionsFacadeService } from '@product-feedback-app-v2/core-state';

import { RoadMapTileComponent } from './roadmap-tile.component';

describe('RoadMapTileComponent', () => {
  let component: RoadMapTileComponent;
  let fixture: ComponentFixture<RoadMapTileComponent>;

  beforeEach(async () => {
    const mockFacade = {
      plannedSuggestions: signal([]),
      inProgressSuggestions: signal([]),
      liveSuggestions: signal([]),
    };

    await TestBed.configureTestingModule({
      imports: [RoadMapTileComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: APP_CONFIG, useValue: { apiEndpoint: 'http://test' } },
        { provide: SuggestionsFacadeService, useValue: mockFacade },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoadMapTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
