import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Song } from 'src/app/classes/song';
import { SongsService } from 'src/app/services/songs.service';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { SupabaseService } from 'src/app/services/supabase.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from 'src/app/utils/header/header.component';
import { SafeUrlPipe } from 'src/app/decorators/safe-url.pipe';
import { TransformYoutubePipe } from 'src/app/decorators/transform-youtube.pipe';
import { PageButtonComponent } from 'src/app/utils/page-button/page-button.component';

@Component({
  selector: 'app-song-detail',
  templateUrl: './song-detail.component.html',
  styleUrls: ['./song-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    SafeUrlPipe,
    TransformYoutubePipe,
    PageButtonComponent
  ]
})
export class SongDetailComponent implements OnInit {
  song!: Song;

  constructor(private sSongs: SongsService, private activatedRoute: ActivatedRoute, private _sanitizer: DomSanitizer,
    private supabase: SupabaseService, private sTitle: Title) {
  }
  ngOnInit() {
    this.activatedRoute.data.subscribe(({ song }) => {
      this.song = new Song(song.data);
      this.sTitle.setTitle(`${this.song.index?this.song.index + ' | ':''}${(this.song.beginning || this.song.title||'Canción')}`);
    })
  }
  
  isLoggedIn() {
    return this.supabase.isLoggedIn();
  }
}
