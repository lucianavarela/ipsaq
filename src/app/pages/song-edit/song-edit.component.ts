import { Component, OnInit } from '@angular/core';
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

  constructor(private sSongs: SongsService, private router: Router, private activatedRoute: ActivatedRoute,
    private toastService: ToastService) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ song }) => {
      if (song) {
        this.song = new Song(song.data);
      } else {
        this.song = new Song();
      }
    })
  }

  async updateSong() {
    try {
      this.loading = true;
      this.sSongs.updateSong(this.song).then((res:any) => this.router.navigateByUrl('/cancionero/'+res.data[0]['id']));
      this.toastService.showSuccessToast('Exito!', 'Canción actualizada.');
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
      this.sSongs.createSong(this.song).then((res:any) => this.router.navigateByUrl('/cancionero/'+res.data[0]['id']));
      this.toastService.showSuccessToast('Exito!', 'Canción agregada.');
    } catch (error: any) {
      this.toastService.showErrorToast('Error al guardar', error.error_description || error.message);
    } finally {
      this.loading = false;
    }
  }
}
