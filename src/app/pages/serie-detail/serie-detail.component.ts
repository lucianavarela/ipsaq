import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Series } from 'src/app/classes/series';
import { Title } from '@angular/platform-browser';
import { SupabaseService } from 'src/app/services/supabase.service';
import { Sermon } from 'src/app/classes/sermon';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from 'src/app/utils/header/header.component';
import { SermonBoxComponent } from '../sermon-box/sermon-box.component';

@Component({
  selector: 'app-serie-detail',
  templateUrl: './serie-detail.component.html',
  styleUrls: ['./serie-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    SermonBoxComponent
  ]
})
export class SerieDetailComponent implements OnInit {
  serie!: Series;

  constructor(private activatedRoute: ActivatedRoute, private supabase: SupabaseService, private sTitle: Title) {
  }
  
  ngOnInit() {
    this.activatedRoute.data.subscribe(({ serie }) => {
      if (serie) {
        this.serie = new Series(serie.data);
        this.sTitle.setTitle(`"${this.serie.name}"` || `Serie #${this.serie.id}`);
        if (this.serie.sermons) {
          this.serie.sermons = this.serie.sermons.map((s: any) => new Sermon(s)).sort((a: Sermon, b: Sermon)  => {
            return a?.chapter_number && b?.chapter_number ? a.chapter_number - b.chapter_number : 0;
          });;
        };
      }
    })
  }

  isLoggedIn() {
    return this.supabase.isLoggedIn();
  }
}
