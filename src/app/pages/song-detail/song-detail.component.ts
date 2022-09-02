import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Song } from 'src/app/classes/song';
import { SongsService } from 'src/app/services/songs.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-song-detail',
  templateUrl: './song-detail.component.html',
  styleUrls: ['./song-detail.component.scss']
})
export class SongDetailComponent implements OnInit {
  song!: Song;
  loading = false;

  constructor(private sSongs: SongsService, private activatedRoute: ActivatedRoute, private _sanitizer: DomSanitizer) {
  }
  ngOnInit() {
    this.activatedRoute.data.subscribe(({ song }) => {
      this.song = song.data;
      if (this.song.link_ipsaq) this.song.link_ipsaq = this._sanitizer.bypassSecurityTrustResourceUrl(this.song.link_ipsaq?.toString());
    })
  }
  
}
