import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeliefsComponent } from './beliefs.component';

describe('BeliefsComponent', () => {
  let component: BeliefsComponent;
  let fixture: ComponentFixture<BeliefsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeliefsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeliefsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
