import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { SermonSong } from 'src/app/classes/sermon-song';
import { Song } from 'src/app/classes/song';
import { SupabaseService } from 'src/app/services/supabase.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-songs-box',
  templateUrl: './songs-box.component.html',
  styleUrls: ['./songs-box.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class SongsBoxComponent implements OnInit {
  isLoggedIn = false;
  private authSub?: Subscription;
  @Input('sermonSongInput') sermonSong!: SermonSong | undefined;
  @Input('editMode') editMode: boolean = false;
  @Output() songDeleted = new EventEmitter<number>();

  constructor(private supabase: SupabaseService) {
  }

  ngOnInit(): void {
    this.authSub = this.supabase.authState$.subscribe(val => {
      this.isLoggedIn = val === true;;
    });
  }

  ngOnDestroy() {
    this.authSub?.unsubscribe();
  }

  deleteSong() {
    if (this.sermonSong?.song) this.songDeleted.emit(this.sermonSong.id);
  }
}
