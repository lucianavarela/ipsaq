import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SupabaseService } from 'src/app/services/supabase.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-page-button',
  templateUrl: './page-button.component.html',
  styleUrl: './page-button.component.scss',
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class PageButtonComponent {
  @Input('needsAuth') needsAuth: boolean = false;
  @Input('url') url!: string | null;
  @Input('icon') icon!: string | null;
  @Input('hoverText') hoverText!: string | null;
  @Input('color') color: string = 'primary';
  @Output() clickedEvent = new EventEmitter<void>();
  isLoggedIn = false;
  private authSub?: Subscription;

  constructor(private supabase: SupabaseService) { }

  ngOnInit() {
    this.authSub = this.supabase.authState$.subscribe(val => {
      this.isLoggedIn = val === true;
    });
  }

  ngOnDestroy() {
    this.authSub?.unsubscribe();
  }

  clicked(): void {
      this.clickedEvent.emit();
  }
}
