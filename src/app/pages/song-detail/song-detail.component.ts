import { Component, OnInit } from '@angular/core';
import { Song } from 'src/app/classes/song';
import { SongsService } from 'src/app/services/songs.service';

@Component({
  selector: 'app-song-detail',
  templateUrl: './song-detail.component.html',
  styleUrls: ['./song-detail.component.scss']
})
export class SongDetailComponent implements OnInit {
  song!: Song;
  loading = false;

  constructor(private sSongs: SongsService) { }

  ngOnInit(): void {
    this.song = new Song();
  }

  async updateSong(song: Song) {
    try {
      this.loading = true;
      await this.sSongs.updateSong(song)
      alert('Canción actualizada!')
    } catch (error: any) {
      alert(error.error_description || error.message)
    } finally {
      this.loading = false;
    }
  }

  async addSong() {
    try {
      this.loading = true;
      delete this.song.id;
      await this.sSongs.createSong(this.song)
      alert('Canción actualizada!')
    } catch (error: any) {
      alert(error.error_description || error.message)
    } finally {
      this.loading = false;
    }
  }
}
