import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Song } from 'src/app/classes/song';
import { SongsService } from 'src/app/services/songs.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-edit-chords',
  templateUrl: './edit-chords.component.html',
  styleUrls: ['./edit-chords.component.scss']
})
export class EditChordsComponent implements OnInit {
  song!: Song;
  chordsText: string = '';

  constructor(private sSongs: SongsService, private router: Router, private activatedRoute: ActivatedRoute,
    private toastService: ToastService) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ song }) => {
      if (song) {
        this.song = new Song(song.data);
        this.chordsText = this.song.chords ?? '';
      } else {
        this.song = new Song();
      }
    })
  }

  async updateSong() {
    try {
      this.sSongs.updateSong(this.song).then((res:any) => this.router.navigateByUrl('/cancionero/'+res.data[0]['index']));
      this.toastService.showSuccessToast('Exito!', 'Canción actualizada.');
    } catch (error: any) {
      this.toastService.showErrorToast('Error al guardar', error.error_description || error.message);
    } finally {
    }
  }

  textAltered() {
    this.song.chords = this.chordsText;
  }
}
