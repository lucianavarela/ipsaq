import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Series } from 'src/app/classes/series';
import { SeriesService } from 'src/app/services/series.service';

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.scss']
})

export class SeriesComponent implements OnInit {
  series: Series[] = [];

  constructor(private sSerie: SeriesService, private _liveAnnouncer: LiveAnnouncer, private sTitle: Title) { }

  ngOnInit(): void {
    this.sTitle.setTitle(`Series`);
    this.sSerie.getSeries().then(res => {
      if (res.data) {
        this.series = res.data.map((s:any) => new Series({ ...s, "sermons_amount": s.sermons[0].count }))
        this.series.map(serie => { if (serie.sermons) serie.sermons_amount = serie.sermons[0].count });
      }
    });
  }
}
