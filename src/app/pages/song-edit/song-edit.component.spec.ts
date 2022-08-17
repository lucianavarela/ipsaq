import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongEditComponent } from './song-edit.component';

describe('SongEditComponent', () => {
  let component: SongEditComponent;
  let fixture: ComponentFixture<SongEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SongEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SongEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
