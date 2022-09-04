import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Sermon } from 'src/app/classes/sermon';
import { SermonsService } from 'src/app/services/sermons.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Song } from 'src/app/classes/song';
import { SermonSong } from 'src/app/classes/sermon-song';

@Component({
  selector: 'app-sermon-detail',
  templateUrl: './sermon-detail.component.html',
  styleUrls: ['./sermon-detail.component.scss']
})
export class SermonDetailComponent implements OnInit {
  sermon!: Sermon;
  loading = false;
  songs: SermonSong[] = []

  constructor(private sSermons: SermonsService, private activatedRoute: ActivatedRoute, private _sanitizer: DomSanitizer) {
  }
  ngOnInit() {
    this.activatedRoute.data.subscribe(({ sermon }) => {
      if (sermon) {
        this.sermon = new Sermon(sermon.data);
        this.sSermons.getSongsOfSermon(sermon.data.id).then((res: any) => this.songs = SermonSong.mapObjects(res.data, sermon.data.id))
      }
    })
  }
  
}
