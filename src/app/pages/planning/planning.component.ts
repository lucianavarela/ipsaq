import { Component } from '@angular/core';
import { addMonths, startOfMonth, endOfMonth, isAfter, isToday } from 'date-fns';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrl: './planning.component.scss'
})
export class PlanningComponent {
  isMobile = false;
  months: { name: string; sundays: Date[] }[] = [];

  constructor() {
    this.isMobile = window.innerWidth <= 767;
    this.generateSchedule();
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
      if (d.getDay() === 0) { // 0 = Domingo
        sundays.push(new Date(d)); // Clonar fecha para evitar referencia
      }
    }
    return sundays;
  }
}
