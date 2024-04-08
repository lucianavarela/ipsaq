import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { SermonSong } from 'src/app/classes/sermon-song';
import { Song } from 'src/app/classes/song';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-songs-box',
  templateUrl: './songs-box.component.html',
  styleUrls: ['./songs-box.component.scss']
})
export class SongsBoxComponent implements OnInit {
  @Input('sermonSongInput') sermonSong!: SermonSong | undefined;
  @Input('editMode') editMode: boolean = false;
  @Output() songDeleted = new EventEmitter<number>();
  isLoggedIn = false;

  constructor(private supabase: SupabaseService) { }

  ngOnInit(): void {
    this.isLoggedIn = !!(this.supabase.isLoggedIn());
  }

  deleteSong() {
    if (this.sermonSong?.song) this.songDeleted.emit(this.sermonSong.id);
  }
}
