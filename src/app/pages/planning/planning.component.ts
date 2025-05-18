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

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrl: './planning.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatRadioModule,
    HeaderComponent,
    MatExpansionModule
  ]
})
export class PlanningComponent implements OnInit {
  isMobile = false;
  loggedProfile!: any | null;
  availabilityLogs: Availability[] = [];
  months: { name: string; sundays: Date[] }[] = [];
  availabilityDict: { [date: string]: {id: number, is_available: string} } = {};

  constructor(private sAvailability: AvailabilityService, private supabase: SupabaseService,
    private sProfile: ProfilesService, private sTitle: Title) {
    this.isMobile = window.innerWidth <= 767;
    this.generateSchedule();
  }

  ngOnInit() {
    this.supabase.setUser();
    this.loggedProfile = this.supabase.getUser;
    this.sTitle.setTitle(`Planificación`);
    this.loadProfileId();
    this.loadAvailabilityLogs();
  }
  
  private loadProfileId() {
    this.sProfile.getProfileByAuthId(this.loggedProfile.user_id).then((res: any) => {
      this.loggedProfile.profile_id = res.data.id; 
    });
  }

  private generateSchedule() {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    for (let i = 0; i < 6; i++) {
      const monthDate = addMonths(today, i);
      const start = startOfMonth(monthDate);
      const end = endOfMonth(monthDate);
      let sundays = this.getSundaysInRange(start, end);
      // Si es el mes actual, filtrar solo los domingos futuros
      if (i === 0) {
        sundays = sundays.filter(date => isAfter(date, today) || isToday(date));
      }
      this.months.push({
        name: monthDate.toLocaleString('default', { month: 'long', year: 'numeric' }),
        sundays
      });
    }
  }

  private getSundaysInRange(start: Date, end: Date): Date[] {
    const sundays: Date[] = [];
    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
      if (d.getDay() === 0) {
        sundays.push(new Date(d));
      }
    }
    return sundays;
  }

  private loadAvailabilityLogs() {
    this.sAvailability.getAvailabilityLogs(this.loggedProfile?.profile_id ?? null).then(res => {
      if (res.data) {
        this.availabilityLogs = res.data.map((s: any) => new Availability(s));
        this.availabilityDict = this.buildDictAvailability();
      }
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

  getAvailabilityForDate(date: Date): string {
    const dateKey = date.toISOString().split('T')[0];
    if (this.availabilityDict.hasOwnProperty(dateKey)) {
      return this.availabilityDict[dateKey].is_available.toString();
    }
    return 'tbd';
  }

  selectionChanged(event: MatRadioChange, date: Date) {
    const dateKey = date.toISOString().split('T')[0];
    switch (event.value) {
      case 'true':
      case 'false':
        if (this.availabilityDict[dateKey]) {
          this.sAvailability.updateAvailability({id: this.availabilityDict[dateKey].id, is_available: event.value==="true"}).then(() => {
            this.availabilityDict[dateKey].is_available = event.value;
          });
        } else {
          this.sAvailability.logAvailability({sermon_date: dateKey, id_user: this.loggedProfile.profile_id, is_available: event.value==="true"}).then((res:any) => {
            this.availabilityDict[dateKey] = {id: res.data.id, is_available: event.value};
          });
        }
        break;
      case 'tbd':
        if (this.availabilityDict[dateKey]) {
          this.sAvailability.deleteAvailabilityLog(this.availabilityDict[dateKey].id).then(() => {
            delete this.availabilityDict[dateKey];
          });
        } else{
          delete this.availabilityDict[dateKey];
        }
        break;
      default:
        break;
    }
  }
}
