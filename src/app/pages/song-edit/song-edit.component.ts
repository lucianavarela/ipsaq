import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Song } from 'src/app/classes/song';
import { SongsService } from 'src/app/services/songs.service';
import { ToastService } from 'src/app/services/toast.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from 'src/app/utils/header/header.component';
import { PageButtonComponent } from 'src/app/utils/page-button/page-button.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-song-edit',
  templateUrl: './song-edit.component.html',
  styleUrls: ['./song-edit.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    PageButtonComponent,
    MatSlideToggleModule
  ]
})
export class SongEditComponent implements OnInit {
  song!: Song;
  songSuggestionFlag = false;
  keyTonic: string | null = null;
  keyMode: boolean = true; // true = mayor, false = menor

  constructor(private sSongs: SongsService, private router: Router, private activatedRoute: ActivatedRoute,
    private toastService: ToastService, private sTitle: Title) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ song }) => {
      if (song) {
        this.song = new Song(song.data);
        this.sTitle.setTitle(`Editar ${this.song.index ? this.song.index + ' | ' : ''}${(this.song.beginning || this.song.title)}`);
        // Separar key en tónica y modo
        if (this.song.key) {
          const match = this.song.key.match(/^([A-G]#?(?:\/Db|\/Eb|\/Gb|\/Ab|\/Bb)?)(m)?$/);
          if (match) {
            this.keyTonic = match[1];
            this.keyMode = match[2] === 'm' ? false : true;
          } else {
            this.keyTonic = null;
            this.keyMode = true;
          }
        } else {
          this.keyTonic = null;
          this.keyMode = true;
        }
      } else {
        this.sTitle.setTitle('Agregar canción');
        this.song = new Song();
        this.keyTonic = null;
        this.keyMode = true;
      }
    })
  }

  async updateSong() {
    if (this.song.beginning) {
      try {
        // Combinar tónica y modo antes de guardar
        this.song.key = this.keyTonic ? `${this.keyTonic}${this.keyMode ? '' : 'm'}` : undefined;
        this.sSongs.getLastIndex().then((res: any) => {
          const nextIndex = (res.data[0].index) + 1;
          if (this.song.suggestion && this.songSuggestionFlag) {
            this.song.suggestion = false;
            this.song.index = nextIndex;
          }
          this.sSongs.updateSong(this.song).then((res: any) => {
            if (res.status && res.status == 400) {
              this.toastService.showErrorToast('Error al guardar', res.error.message);
            } else {
              this.toastService.showSuccessToast('Exito!', 'Canción actualizada.');
              if (this.song.suggestion) {
                this.router.navigateByUrl('/canciones_sugeridas/' + this.song.id);
              } else {
                this.router.navigateByUrl('/cancionero/' + this.song.index);
              }
            }
          });
        })
      } catch (error: any) {
        this.toastService.showErrorToast('Error al guardar', error.error_description || error.message);
      }
    } else {
      this.toastService.showErrorToast('Error al guardar', "El comienzo de la canción es un campo obligatorio.");
    }
  }

  async addSong() {
    if (this.song.beginning) {
      try {
        // Combinar tónica y modo antes de guardar
        this.song.key = this.keyTonic ? `${this.keyTonic}${this.keyMode ? '' : 'm'}` : undefined;
        delete this.song.id;
        this.sSongs.getLastIndex().then((res: any) => {
          this.song.index = (res.data[0].index) + 1;
          this.sSongs.createSong(this.song).then((res: any) => this.router.navigateByUrl('/cancionero/' + res.data[0]['index']));
          this.toastService.showSuccessToast('Exito!', 'Canción agregada.');
        });
      } catch (error: any) {
        this.toastService.showErrorToast('Error al guardar', error.error_description || error.message);
      }
    } else {
      this.toastService.showErrorToast('Error al guardar', "El comienzo de la canción es un campo obligatorio.");
    }
  }

  removeSuggestion() {
    const confirmation = confirm("Seguro que desea eliminar esta sugerencia?");

    if (confirmation && this.song.id) {
      try {
        this.sSongs.deleteSong(this.song.id).then((res: any) => this.router.navigateByUrl('/canciones_sugeridas'));
      } catch (error: any) {
        this.toastService.showErrorToast('Error al guardar', error.error_description || error.message);
      } finally {
      }
    }
  }
}
