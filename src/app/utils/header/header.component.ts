import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input('color') color: string = 'is-primary';
  @Input('overtitle') overtitle!: string | null | undefined;
  @Input('title') title!: string | null | undefined;
  @Input('undertitle') undertitle!: string | null | undefined;
  @Input('index') index!: number | null | undefined;

  constructor(private _location: Location, private supabase: SupabaseService) { }

  ngOnInit(): void {
  }

  goBack() {
    this._location.back();
  }
}
