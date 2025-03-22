import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplorerSongsComponent } from './explorer-songs.component';

describe('ExplorerSongsComponent', () => {
  let component: ExplorerSongsComponent;
  let fixture: ComponentFixture<ExplorerSongsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExplorerSongsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExplorerSongsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
