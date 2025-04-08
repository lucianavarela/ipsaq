import { Component, OnInit } from '@angular/core';
import { AuthUser } from '@supabase/supabase-js';
import { addMonths, startOfMonth, endOfMonth, isAfter, isToday } from 'date-fns';
import { Availability } from 'src/app/classes/availability';
import { AvailabilityService } from 'src/app/services/availability.service';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrl: './planning.component.scss'
})
export class PlanningComponent implements OnInit {
  isMobile = false;
  loggedUser!: any | null;
  availabilityLogs: Availability[] = [];
  months: { name: string; sundays: Date[] }[] = [];
  availabilityDict: { [date: string]: boolean } = {};

  constructor(private sAvailability: AvailabilityService, private supabase: SupabaseService) {
    this.isMobile = window.innerWidth <= 767;
    this.generateSchedule();
  }

  ngOnInit() {
    this.supabase.setUser();
    this.loggedUser = this.supabase.getUser;
    this.loadAvailabilityLogs();
  }

  private generateSchedule() {
    const today = new Date();
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
    this.sAvailability.getAvailabilityLogs(this.loggedUser?.user_id ?? null).then(res => {
      if (res.data) {
        this.availabilityLogs = res.data.map((s: any) => new Availability(s));
        this.availabilityDict = this.buildDictAvailability();
        console.log(this.availabilityDict)
      }
    });
  }

  buildDictAvailability() {
    const dict: any = {};
    this.availabilityLogs.forEach((availability) => {
      if (availability.sermon_date?.toString()) {
        dict[availability.sermon_date?.toString()] = availability.is_available;
      }
    });
    return dict;
  }

  getAvailabilityForDate(date: Date): string {
    const dateKey = date.toISOString().split('T')[0];
    if (this.availabilityDict.hasOwnProperty(dateKey)) {
      return this.availabilityDict[dateKey] ? 'true' : 'false';
    }
    return 'tbd';
  }
}
