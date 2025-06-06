import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Sermon } from './classes/sermon';
import { SermonsService } from './services/sermons.service';
import { SupabaseService } from './services/supabase.service';
import { MatDialog } from '@angular/material/dialog';
import Utils from "src/app/utils/utils";
import { LiveSermonComponent } from './pages/live-sermon/live-sermon.component';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { ToastService } from './services/toast.service';
import { CommonModule, NgIf, NgClass } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToasterComponent } from './utils/toaster/toaster.component';
import { Profile } from './classes/profile';
/// <reference path="<relevant path>/node_modules/@types/googlemaps/index.d.ts" />


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: { 'window:beforeunload': 'toggleNavbar' },
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    RouterLink,
    NgIf, 
    MatTooltipModule,
    ToasterComponent
  ]
})
export class AppComponent implements OnInit {
  isMobile = false;
  menuDisplayed = false;
  dropdownDisplayed = "";
  sermonIsLive = false;
  upcomingSermonSearched: boolean = false;
  hideHeaderFooter = false;
  upcomingSermon!: Sermon;
  loggedUser!: Profile | null;
  @ViewChild('hamburguer') hamburguer!: ElementRef;
  @ViewChild('infoDropdown') infoDropdown!: ElementRef;
  @ViewChild('sermonsDropdown') sermonsDropdown!: ElementRef;
  @ViewChild('songsDropdown') songsDropdown!: ElementRef;

  constructor(private readonly supabase: SupabaseService, private sSermon: SermonsService,
    public dialog: MatDialog, private renderer: Renderer2, private router: Router, private sToast: ToastService) {
    this.isMobile = window.innerWidth <= 767;

    this.renderer.listen('window', 'click', (e: Event) => {
      if (e.target !== this.infoDropdown.nativeElement && (!this.sermonsDropdown || e.target !== this.sermonsDropdown.nativeElement) &&
        e.target !== this.songsDropdown.nativeElement && e.target !== this.hamburguer.nativeElement) {
        this.resetMenu();
      }
    });
  }

  ngOnInit() {
    this.loadUser();
    if (!this.upcomingSermonSearched) this.setUpNewSermon();
  }
  
  async loadUser() {
    await this.supabase.setUser();
    this.loggedUser = this.supabase.getUser;
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
    this.sSermon.getUpcomingSermon().then((res: any) => {
      this.upcomingSermonSearched = true;
      if (res?.data.length) {
        this.upcomingSermon = new Sermon(res.data[0]);
        const nowHour = new Date().getUTCHours();
        const sermonHour = Number(this.upcomingSermon?.time?.split(':')[0]) ?? '';
        if (this.upcomingSermon && this.upcomingSermon.date && sermonHour &&
          this.upcomingSermon.date.toString() == Utils.getTheDate('today') &&
          (nowHour == sermonHour || nowHour == sermonHour + 1)
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

  logOut() {
    this.supabase.signOut().then(res => {
      this.sToast.showSuccessToast("Exito", "Sesión finalizada!");
      this.router.navigate(['/']);
    })
  }
}
