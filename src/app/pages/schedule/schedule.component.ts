import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { Sermon } from 'src/app/classes/sermon';
import { Profile } from 'src/app/classes/profile';
import { SermonsService } from 'src/app/services/sermons.service';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from 'src/app/utils/header/header.component';
import { MatChipsModule } from '@angular/material/chips';
import { ProfilesService } from 'src/app/services/profiles.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    RouterLink,
    MatTableModule,
    MatChipsModule,
    HeaderComponent
  ]
})

export class ScheduleComponent implements OnInit {
  isMobile = false;
  displayedColumns: string[] = ['sermon_date'];
  namesHeaders: string[] = [];
  sermons: Sermon[] = [];
  profiles: Profile[] = [];
  dataSource = new MatTableDataSource<Sermon>();
  expandedElement!: Sermon | null;
  filtersClasses: string = 'filter-choir filter-players filter-directors';
  
  constructor(private sSermon: SermonsService, private sProfile: ProfilesService, private sTitle: Title) {
    this.isMobile = window.innerWidth <= 767;
  }
  
  ngOnInit(): void {
    this.sTitle.setTitle(`Cronograma`);
    this.sSermon.getSermonsWithBand().then(res => {
      if (res.data) this.sermons = res.data.map((o:any) => new Sermon(o))
      this.dataSource = new MatTableDataSource(this.sermons);
    });
    this.sProfile.getProfiles().then((res: any) => {
      res.data?.filter((u:Profile) => u.band_role||u.choir_role||u.direction_role).map((s: any) => {
        this.namesHeaders.push(s.nickname)
        this.profiles.push(new Profile(s));
      });
      this.displayedColumns = this.displayedColumns.concat(this.namesHeaders);
    });
  }

  onFiltersChange(event: any) {
    this.filtersClasses = '';
    event.value.forEach((f: string) => this.filtersClasses = this.filtersClasses.concat(` filter-${f}`));
  }
}
