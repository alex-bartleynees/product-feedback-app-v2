import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoadMapCardComponent } from './road-map-card.component';

describe('RoadMapCardComponent', () => {
  let component: RoadMapCardComponent;
  let fixture: ComponentFixture<RoadMapCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoadMapCardComponent],
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
