import { Component, OnInit } from '@angular/core';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { addMonths, startOfMonth, endOfMonth, isAfter, isToday } from 'date-fns';
import { Availability } from 'src/app/classes/availability';
import { AvailabilityService } from 'src/app/services/availability.service';
import { SupabaseService } from 'src/app/services/supabase.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from 'src/app/utils/header/header.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { ProfilesService } from 'src/app/services/profiles.service';
import { Title } from '@angular/platform-browser';
import { SpecialSermon } from 'src/app/classes/special-sermon';
import { PlanningService } from 'src/app/services/planning.service';
import { PlanningDataService } from 'src/app/services/planning-data.service';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrl: './planning.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatRadioModule,
    MatExpansionModule
  ]
})
export class PlanningComponent implements OnInit {
  isMobile = false;
  summaryDates: any[] = [];
  showSummary = false;
  loggedProfile!: any | null;
  availabilityLogs: Availability[] = [];
  months: { name: string; dates: string[] }[] = [];
  availabilityDict: { [date: string]: {id: number, is_available: string} } = {};

  constructor(
    private sAvailability: AvailabilityService, 
    private supabase: SupabaseService,
    private sProfile: ProfilesService,
    private planningService: PlanningService,
    private planningDataService: PlanningDataService,
    private sTitle: Title
  ) {
    this.isMobile = window.innerWidth <= 767;
  }

  ngOnInit() {
    this.supabase.setUser();
    this.loggedProfile = this.supabase.getUser;
    this.sTitle.setTitle(`Planificación`);
    this.sProfile.getProfileByAuthId(this.loggedProfile.user_id).then((res: any) => {
      this.loggedProfile.profile_id = res.data.id;
      this.loadData();
    });
  }
  
  private async loadData() {
    // Cargar fechas especiales y domingos
    const availabilityLogs = await this.sAvailability.getAvailabilityLogs(this.loggedProfile.profile_id);
    if (availabilityLogs && availabilityLogs.data) {
      this.availabilityLogs = Availability.mapObjects(availabilityLogs.data);
      this.availabilityDict = this.buildDictAvailability();
    }
    const specialSermons = await this.planningService.getSpecialSermons();
    const specialDates = specialSermons.map(e => e.sermon_date);
    const sundays = this.planningService.getSundays(6);
    const sermonDates = Array.from(new Set([...sundays, ...specialDates])).sort();

    // Agrupar datos
    this.months = this.planningDataService.groupByMonth(sermonDates);

    // Cargar summary
    this.sAvailability.getUpcomingAvailabilityLogs().then((availabilities: any) => {
      const allUpcomingAvailabilities = Availability.mapObjects(availabilities.data);
      this.summaryDates = this.planningDataService.getAvailabilitySummary(allUpcomingAvailabilities);
    });
  }

  buildDictAvailability() {
    const dict: any = {};
    this.availabilityLogs.forEach((availability) => {
      if (availability.sermon_date?.toString()) {
        dict[availability.sermon_date?.toString()] = {
          id: availability.id,
          is_available: availability.is_available
        }
      }
    });
    return dict;
  }

  getAvailabilityForDate(date: string): string {
    if (this.availabilityDict.hasOwnProperty(date)) {
      return this.availabilityDict[date].is_available.toString();
    }
    return 'tbd';
  }

  selectionChanged(event: MatRadioChange, date: string) {
    switch (event.value) {
      case 'true':
      case 'false':
        if (this.availabilityDict[date]) {
          this.sAvailability.updateAvailability({id: this.availabilityDict[date].id, is_available: event.value==="true"}).then(() => {
            this.availabilityDict[date].is_available = event.value;
          });
        } else {
          this.sAvailability.logAvailability({sermon_date: date, id_user: this.loggedProfile.profile_id, is_available: event.value==="true"}).then((res:any) => {
            this.availabilityDict[date] = {id: res.data.id, is_available: event.value};
          });
        }
        break;
      case 'tbd':
        if (this.availabilityDict[date]) {
          this.sAvailability.deleteAvailabilityLog(this.availabilityDict[date].id).then(() => {
            delete this.availabilityDict[date];
          });
        } else{
          delete this.availabilityDict[date];
        }
        break;
      default:
        break;
    }
  }
}
