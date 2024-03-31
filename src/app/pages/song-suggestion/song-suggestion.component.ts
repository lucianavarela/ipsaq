import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Song } from 'src/app/classes/song';
import { SongsService } from 'src/app/services/songs.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-song-suggestion',
  templateUrl: './song-suggestion.component.html',
  styleUrls: ['./song-suggestion.component.scss']
})
export class SongSuggestionComponent implements OnInit {
  song!: Song;
  loading = false;

  constructor(private sSongs: SongsService, private router: Router, private activatedRoute: ActivatedRoute,
    private toastService: ToastService, private sTitle: Title) { }

  ngOnInit() {
    this.sTitle.setTitle('Sugerir una canción');
    this.activatedRoute.data.subscribe(({ song }) => {
      if (song) {
        this.song = new Song(song.data);
      } else {
        this.song = new Song();
      }
    })
  }

  async suggestSong() {
    try {
      this.loading = true;
      delete this.song.id;
      this.song.suggestion = true;
      this.sSongs.createSong(this.song).then((res:any) => this.router.navigateByUrl('/canciones_sugeridas'));
      this.toastService.showSuccessToast('Exito!', 'Sugerencia guardada.');
    } catch (error: any) {
      this.toastService.showErrorToast('Error al guardar', error.error_description || error.message);
    } finally {
      this.loading = false;
    }
  }
}
