import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SermonBoxComponent } from './sermon-box.component';

describe('SermonBoxComponent', () => {
  let component: SermonBoxComponent;
  let fixture: ComponentFixture<SermonBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SermonBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SermonBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
