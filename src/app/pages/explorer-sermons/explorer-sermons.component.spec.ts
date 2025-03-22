import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplorerSermonsComponent } from './explorer-sermons.component';

describe('ExplorerSermonsComponent', () => {
  let component: ExplorerSermonsComponent;
  let fixture: ComponentFixture<ExplorerSermonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExplorerSermonsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExplorerSermonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
