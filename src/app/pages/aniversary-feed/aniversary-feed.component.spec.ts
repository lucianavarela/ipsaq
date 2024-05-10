import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AniversaryFeedComponent } from './aniversary-feed.component';

describe('AniversaryFeedComponent', () => {
  let component: AniversaryFeedComponent;
  let fixture: ComponentFixture<AniversaryFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AniversaryFeedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AniversaryFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
