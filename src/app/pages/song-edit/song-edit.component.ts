import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Song } from 'src/app/classes/song';
import { SongsService } from 'src/app/services/songs.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-song-edit',
  templateUrl: './song-edit.component.html',
  styleUrls: ['./song-edit.component.scss']
})
export class SongEditComponent implements OnInit {
  song!: Song;
  loading = false;
  songSuggestionFlag = false;

  constructor(private sSongs: SongsService, private router: Router, private activatedRoute: ActivatedRoute,
    private toastService: ToastService, private sTitle: Title) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ song }) => {
      if (song) {
        this.song = new Song(song.data);
        this.sTitle.setTitle(`Editar ${this.song.index?this.song.index + ' | ':''}${(this.song.beginning || this.song.title)}`);
      } else {
        this.sTitle.setTitle('Agregar canción');
        this.song = new Song();
      }
    })
  }

  async updateSong() {
    try {
      this.loading = true;
      this.sSongs.getLastIndex().then((res:any) => {
        const nextIndex = (res.data[0].index) + 1;
        if (this.song.suggestion && this.songSuggestionFlag) {
          this.song.suggestion = false;
          this.song.index = nextIndex;
        }
        this.sSongs.updateSong(this.song).then((res:any) => {
          if (res.status && res.status == 400) {
            this.toastService.showErrorToast('Error al guardar', res.error.message);
          } else {
            this.toastService.showSuccessToast('Exito!', 'Canción actualizada.');
            this.router.navigateByUrl('/cancionero/'+this.song.index);
          }
        });
      })
    } catch (error: any) {
      this.toastService.showErrorToast('Error al guardar', error.error_description || error.message);
    } finally {
      this.loading = false;
    }
  }

  async addSong() {
    try {
      this.loading = true;
      delete this.song.id;
      this.sSongs.getLastIndex().then((res:any) => {
        this.song.index = (res.data[0].index) + 1;
        this.sSongs.createSong(this.song).then((res:any) => this.router.navigateByUrl('/cancionero/'+res.data[0]['index']));
        this.toastService.showSuccessToast('Exito!', 'Canción agregada.');
      });
    } catch (error: any) {
      this.toastService.showErrorToast('Error al guardar', error.error_description || error.message);
    } finally {
      this.loading = false;
    }
  }

  removeSuggestion() {
    const confirmation = confirm("Seguro que desea eliminar esta sugerencia?");

    if (confirmation && this.song.id) {
      try {
        this.sSongs.deleteSong(this.song.id).then((res:any) => this.router.navigateByUrl('/cancionero'));
      } catch (error: any) {
        this.toastService.showErrorToast('Error al guardar', error.error_description || error.message);
      } finally {
        this.loading = false;
      }
    }
  }
}
