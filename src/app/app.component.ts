import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
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
  dropdownDisplayed = "";
  sermonIsLive = false;
  upcomingSermonSearched: boolean = false;
  upcomingSermon!: Sermon;
  @ViewChild('infoDropdown') infoDropdown!: ElementRef;
  @ViewChild('sermonsDropdown') sermonsDropdown!: ElementRef;
  @ViewChild('songsDropdown') songsDropdown!: ElementRef;

  constructor(private readonly supabase: SupabaseService, private sSermon: SermonsService,
    public dialog: MatDialog, private renderer: Renderer2) {
    this.supabase.setUser();
    this.renderer.listen('window', 'click',(e:Event)=>{
     if(e.target !== this.infoDropdown.nativeElement && e.target!==this.sermonsDropdown.nativeElement && e.target!==this.songsDropdown.nativeElement){
         this.resetMenu();
     }
 });
  }

  ngOnInit() {
    if (!this.upcomingSermonSearched) this.setUpNewSermon();
  }

  isLoggedIn() {
    return this.supabase.isLoggedIn();
  }

  toggleNavbar() {
    this.menuDisplayed = !this.menuDisplayed;
  }

  resetMenu() {
    this.menuDisplayed = false;
    this.dropdownDisplayed = "";
  }

  setUpNewSermon() {
    this.sSermon.getUpcomingSermon().then((res:any) => {
      this.upcomingSermonSearched = true;
      if(res?.data.length) {
        this.upcomingSermon = new Sermon(res.data[0]);
        let today = new Date();
        if (this.upcomingSermon && 
          this.upcomingSermon.date && 
          this.upcomingSermon.date.toString() == Utils.getTheDate('today') && 
          ['14','15'].indexOf(today.toISOString().split('T')[1].slice(0,2)) > -1
          ) {
          this.sermonIsLive = true;
          this.openSermon();
        }
      }
    });
  }

  openSermon() {
    this.dialog.open(LiveSermonComponent, {
      width: '75%', height: 'auto',
      data: {
        sermon: this.upcomingSermon
      }
    });
  }

  toggleMenu(menu: string) {
    this.dropdownDisplayed = menu;
  }
}
