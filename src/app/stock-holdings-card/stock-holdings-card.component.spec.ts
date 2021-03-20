import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockHoldingsCardComponent } from './stock-holdings-card.component';

describe('StockHoldingsCardComponent', () => {
  let component: StockHoldingsCardComponent;
  let fixture: ComponentFixture<StockHoldingsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockHoldingsCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockHoldingsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
