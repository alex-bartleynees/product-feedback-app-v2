import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipListTileComponent } from './chiplist-tile.component';

describe('ChipListTileComponent', () => {
  let component: ChipListTileComponent;
  let fixture: ComponentFixture<ChipListTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChipListTileComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChipListTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
