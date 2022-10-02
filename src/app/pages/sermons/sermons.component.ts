import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Sermon } from 'src/app/classes/sermon';
import { SermonsService } from 'src/app/services/sermons.service';

@Component({
  selector: 'app-sermons',
  templateUrl: './sermons.component.html',
  styleUrls: ['./sermons.component.scss']
})

export class SermonsComponent implements OnInit {
  displayedColumns: string[] = ['title', 'date', 'bible', 'info', 'button_to_page'];
  sermons: Sermon[] = [];
  dataSource = new MatTableDataSource<Sermon>();
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(private sSermon: SermonsService, private _liveAnnouncer: LiveAnnouncer) { }
  
  ngOnInit(): void {
    this.sSermon.getSermons().then(res => {
      if (res.data) this.sermons = res.data.map(o => new Sermon(o))
      this.dataSource = new MatTableDataSource(this.sermons);
      this.dataSource.sort = this.sort;
    });
  }
}
