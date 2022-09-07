import { Component, OnInit } from '@angular/core';
import { SupabaseService } from './services/supabase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: {'window:beforeunload': 'toggleNavbar'}
})
export class AppComponent implements OnInit {
  menuDisplayed = false;

  constructor(private readonly supabase: SupabaseService) {
    this.supabase.setUser();
  }

  ngOnInit() {
  }

  isLoggedIn() {
    return this.supabase.isLoggedIn();
  }

  toggleNavbar() {
    this.menuDisplayed = !this.menuDisplayed;
  }

  resetMenu() {
    this.menuDisplayed = false;
  }
}
