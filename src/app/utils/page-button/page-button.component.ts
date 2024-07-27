import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-page-button',
  templateUrl: './page-button.component.html',
  styleUrl: './page-button.component.scss'
})
export class PageButtonComponent {
  @Input('needsAuth') needsAuth: boolean = false;
  @Input('url') url!: string | null;
  @Input('icon') icon!: string | null;
  @Input('hoverText') hoverText!: string | null;
  @Input('color') color: string = 'primary';
  @Output() clickedEvent = new EventEmitter<void>();

  constructor(private supabase: SupabaseService) { }

  isLoggedIn() {
    return this.supabase.isLoggedIn();
  }

  clicked(): void {
      this.clickedEvent.emit();
  }
}
