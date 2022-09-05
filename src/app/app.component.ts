import { Component, OnInit } from '@angular/core';
import { SupabaseService } from './services/supabase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  session = this.supabase.session

  constructor(private readonly supabase: SupabaseService) {
    this.supabase.setUser();
  }

  ngOnInit() {
  }

  isLoggedIn() {
    return this.supabase.isLoggedIn();
  }

}
