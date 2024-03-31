import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongsBoxComponent } from './songs-box.component';

describe('SongsBoxComponent', () => {
  let component: SongsBoxComponent;
  let fixture: ComponentFixture<SongsBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SongsBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SongsBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
