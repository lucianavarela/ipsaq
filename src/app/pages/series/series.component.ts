import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { Series } from 'src/app/classes/series';
import { Sermon } from 'src/app/classes/sermon';
import { SeriesService } from 'src/app/services/series.service';

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.scss']
})

export class SeriesComponent implements OnInit {
  displayedColumns: string[] = ['name', 'chapters', 'button_to_page'];
  series: Series[] = [];
  dataSource = new MatTableDataSource<Series>();
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private sSerie: SeriesService, private _liveAnnouncer: LiveAnnouncer, private sTitle: Title) { }

  ngOnInit(): void {
    this.sTitle.setTitle(`Cultos`);
    this.sSerie.getSeries().then(res => {
      if (res.data) {
        this.series = res.data.map((s:any) => new Series({ ...s, "sermons_amount": s.sermons[0].count }))
        this.series.map(serie => { if (serie.sermons) serie.sermons_amount = serie.sermons[0].count });
        this.dataSource = new MatTableDataSource(this.series);
        this.dataSource.sort = this.sort;
      }
    });
  }
}
