import { Component, OnInit } from '@angular/core';
import { Sermon } from './classes/sermon';
import { SermonsService } from './services/sermons.service';
import { SupabaseService } from './services/supabase.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import Utils from "src/app/utils/utils";
import { LiveSermonComponent } from './pages/live-sermon/live-sermon.component';
/// <reference path="<relevant path>/node_modules/@types/googlemaps/index.d.ts" />


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: {'window:beforeunload': 'toggleNavbar'}
})
export class AppComponent implements OnInit {
  menuDisplayed = false;
  sermonIsLive = false;
  upcomingSermon!: Sermon;

  constructor(private readonly supabase: SupabaseService, private sSermon: SermonsService,
    public dialog: MatDialog) {
    this.supabase.setUser();
  }

  ngOnInit() {
    this.setUpNewSermon();
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

  setUpNewSermon() {
    this.sSermon.getUpcomingSermon().then((res:any) => {
      this.upcomingSermon = new Sermon(res.data[0]);
      let today = new Date();
      if (this.upcomingSermon && 
        this.upcomingSermon.date && 
        this.upcomingSermon.date.toString() == Utils.getToday() && 
        ['08','09'].indexOf(today.toISOString().split('T')[1].slice(0,2)) > -1
        ) {
        this.sermonIsLive = true;
        this.openSermon();
      }
    });
  }

  openSermon() {
    console.log(this.upcomingSermon)
    this.dialog.open(LiveSermonComponent, {
      width: '75%', height: 'auto',
      data: {
        sermon: this.upcomingSermon
      }
    });
  }
}
