import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Song } from 'src/app/classes/song';
import { SongsService } from 'src/app/services/songs.service';

@Component({
  selector: 'app-song-edit',
  templateUrl: './song-edit.component.html',
  styleUrls: ['./song-edit.component.scss']
})
export class SongEditComponent implements OnInit {
  song!: Song;
  loading = false;

  constructor(private sSongs: SongsService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ song }) => {
      if (song) {
        this.song = song;
      } else {
        this.song = new Song();
      }
    })
  }

  async updateSong(song: Song) {
    try {
      this.loading = true;
      let { data: Song, error } = await this.sSongs.updateSong(song)

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
      this.sSongs.createSong(this.song).then((res:any) => this.router.navigateByUrl('/cancionero/'+res.data[0]['id']));
    } catch (error: any) {
      alert(error.error_description || error.message)
    } finally {
      this.loading = false;
    }
  }
}
