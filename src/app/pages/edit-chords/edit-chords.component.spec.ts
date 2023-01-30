import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditChordsComponent } from './edit-chords.component';

describe('EditChordsComponent', () => {
  let component: EditChordsComponent;
  let fixture: ComponentFixture<EditChordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditChordsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditChordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
