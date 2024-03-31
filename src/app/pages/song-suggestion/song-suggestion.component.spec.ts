import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongSuggestionComponent } from './song-suggestion.component';

describe('SongEditComponent', () => {
  let component: SongSuggestionComponent;
  let fixture: ComponentFixture<SongSuggestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SongSuggestionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SongSuggestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
