import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Series } from 'src/app/classes/series';
import { Title } from '@angular/platform-browser';
import { SupabaseService } from 'src/app/services/supabase.service';
import { Sermon } from 'src/app/classes/sermon';

@Component({
  selector: 'app-serie-detail',
  templateUrl: './serie-detail.component.html',
  styleUrls: ['./serie-detail.component.scss']
})
export class SerieDetailComponent implements OnInit {
  serie!: Series;
  loading = false;

  constructor(private activatedRoute: ActivatedRoute, private supabase: SupabaseService, private sTitle: Title) {
  }
  
  ngOnInit() {
    this.activatedRoute.data.subscribe(({ serie }) => {
      if (serie) {
        this.serie = new Series(serie.data);
        this.sTitle.setTitle('Serie ' + (`"${this.serie.name}"`) || `#${this.serie.id}`);
        if (this.serie.sermons) {
          this.serie.sermons = this.serie.sermons.map((s: any) => new Sermon(s)).sort((a: Sermon, b: Sermon)  => {
            if (a.date && b.date) {
              let dateA = new Date(a.date);
              let dateB = new Date(b.date);
              return dateA.getTime() - dateB.getTime();
            }
            return 0;
          });;
        };
      }
    })
  }
  
  isLoggedIn() {
    return this.supabase.isLoggedIn();
  }
}
