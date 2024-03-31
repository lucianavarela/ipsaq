import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SermonEditComponent } from './sermon-edit.component';

describe('SermonEditComponent', () => {
  let component: SermonEditComponent;
  let fixture: ComponentFixture<SermonEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SermonEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SermonEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
