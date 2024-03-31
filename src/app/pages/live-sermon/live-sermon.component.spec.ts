import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveSermonComponent } from './live-sermon.component';

describe('LiveSermonComponent', () => {
  let component: LiveSermonComponent;
  let fixture: ComponentFixture<LiveSermonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveSermonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveSermonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
