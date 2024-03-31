import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Sermon } from 'src/app/classes/sermon';
import { SermonsService } from 'src/app/services/sermons.service';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { SermonSong } from 'src/app/classes/sermon-song';
import { SupabaseService } from 'src/app/services/supabase.service';
import { SermonBand } from 'src/app/classes/sermon-band';

@Component({
  selector: 'app-sermon-detail',
  templateUrl: './sermon-detail.component.html',
  styleUrls: ['./sermon-detail.component.scss']
})
export class SermonDetailComponent implements OnInit {
  sermon!: Sermon;
  songs: SermonSong[] = []
  band: SermonBand[] = []
  choir: SermonBand[] = []

  constructor(private sSermons: SermonsService, private activatedRoute: ActivatedRoute, private _sanitizer: DomSanitizer,
    private supabase: SupabaseService, private sTitle: Title) {
  }
  ngOnInit() {
    this.activatedRoute.data.subscribe(({ sermon }) => {
      if (sermon) {
        this.sermon = new Sermon(sermon.data);
        this.sTitle.setTitle(this.sermon.title || `Culto${this.sermon.date ? ' del '  + new Date(this.sermon.date).toLocaleDateString() : ''}`);
        this.sSermons.getSongsOfSermon(sermon.data.id).then((res: any) => this.songs = SermonSong.mapObjects(res.data, sermon.data.id));
        this.sSermons.getBandOfSermon(sermon.data.id).then((res: any) => {
          const players = SermonBand.mapObjects(res.data, sermon.data.id);
          this.band = players.filter(p => p.player?.band_role);
          this.choir = players.filter(p => p.player?.choir_role);
        });
      }
    })
  }
  
  isLoggedIn() {
    return this.supabase.isLoggedIn();
  }
}
