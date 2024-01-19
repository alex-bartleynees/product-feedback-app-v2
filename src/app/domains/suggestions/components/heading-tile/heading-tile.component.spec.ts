import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadingTileComponent } from './heading-tile.component';

describe('HeadingTileComponent', () => {
  let component: HeadingTileComponent;
  let fixture: ComponentFixture<HeadingTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeadingTileComponent],
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
