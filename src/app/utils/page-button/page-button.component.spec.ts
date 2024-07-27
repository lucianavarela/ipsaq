import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageButtonComponent } from './page-button.component';

describe('PageButtonComponent', () => {
  let component: PageButtonComponent;
  let fixture: ComponentFixture<PageButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PageButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
