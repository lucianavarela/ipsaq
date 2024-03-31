import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovernmentComponent } from './government.component';

describe('GovernmentComponent', () => {
  let component: GovernmentComponent;
  let fixture: ComponentFixture<GovernmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GovernmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GovernmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
