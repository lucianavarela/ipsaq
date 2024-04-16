import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { Sermon } from 'src/app/classes/sermon';
import { User } from 'src/app/classes/user';
import { SermonsService } from 'src/app/services/sermons.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})

export class ScheduleComponent implements OnInit {
  isMobile = false;
  displayedColumns: string[] = ['sermon_date'];
  namesHeaders: string[] = [];
  sermons: Sermon[] = [];
  users: User[] = [];
  dataSource = new MatTableDataSource<Sermon>();
  expandedElement!: Sermon | null;
  filtersClasses: string = 'filter-choir filter-players filter-directors';
  
  constructor(private sSermon: SermonsService, private sUser: UsersService, private sTitle: Title) {
    this.isMobile = window.innerWidth <= 767;
  }
  
  ngOnInit(): void {
    this.sTitle.setTitle(`Cronograma`);
    this.sSermon.getSermonsWithBand().then(res => {
      if (res.data) this.sermons = res.data.map((o:any) => new Sermon(o))
      this.dataSource = new MatTableDataSource(this.sermons);
    });
    this.sUser.getUsers().then((res: any) => {
      res.data?.filter((u:User) => u.band_role||u.choir_role||u.direction_role).map((s: any) => {
        this.namesHeaders.push(s.nickname)
        this.users.push(new User(s));
      });
      this.displayedColumns = this.displayedColumns.concat(this.namesHeaders);
    });
  }

  onFiltersChange(event: any) {
    this.filtersClasses = '';
    event.value.forEach((f: string) => this.filtersClasses = this.filtersClasses.concat(` filter-${f}`));
  }
}
