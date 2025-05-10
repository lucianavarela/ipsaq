import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { Sermon } from "src/app/classes/sermon";
import { SermonSong } from "src/app/classes/sermon-song";
import { Song } from "src/app/classes/song";
import { SermonsService } from "src/app/services/sermons.service";
import { SongsService } from "src/app/services/songs.service";
import { ToastService } from "src/app/services/toast.service";
import { NgSelectComponent } from '@ng-select/ng-select';
import { Series } from "src/app/classes/series";
import { SeriesService } from "src/app/services/series.service";
import { Title } from "@angular/platform-browser";
import Utils from "src/app/utils/utils";
import { User } from "src/app/classes/user";
import { UsersService } from "src/app/services/users.service";
import { SermonBand } from "src/app/classes/sermon-band";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { HeaderComponent } from "src/app/utils/header/header.component";
import { SongsBoxComponent } from "../songs-box/songs-box.component";
import { PageButtonComponent } from "src/app/utils/page-button/page-button.component";

@Component({
  selector: "app-sermon-edit",
  templateUrl: "./sermon-edit.component.html",
  styleUrls: ["./sermon-edit.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    NgSelectModule,
    HeaderComponent,
    SongsBoxComponent,
    PageButtonComponent
  ]
})
export class SermonEditComponent implements OnInit {
  @ViewChild(NgSelectComponent) ngSelectComponent!: NgSelectComponent;
  sermon!: Sermon;
  datetime: string = '';
  series: Series[] = [];
  songs: SermonSong[] = [];
  allPreachers: User[] = [];
  allDirectors: User[] = [];
  allSongs: Song[] = [];
  selectedSong!: Song | null;
  allPlayers: SermonBand[] = [];
  selectedPlayers: SermonBand[] = [];
  playersToAdd: any[] = [];
  playersToDelete: number[] = [];

  constructor(
    private sSermons: SermonsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService,
    private sSeries: SeriesService,
    private sSong: SongsService,
    private sUser: UsersService,
    private sTitle: Title
  ) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ sermon }) => {
      if (sermon) {
        this.sermon = new Sermon(sermon.data);
        
        if (this.sermon.date && this.sermon.time) {
          const timeValue = this.sermon.time.split(':', 2);
          this.datetime = `${this.sermon.date}T${Number(timeValue[0])-3}:${timeValue[1]}`
        }

        this.sTitle.setTitle(`Editar Culto ${this.sermon.title ? '"' + this.sermon.title + '"' : this.sermon.date ? 'del ' + 
        new Date(this.sermon.date).toLocaleDateString() : ''}`);
        this.getUsers(sermon.data.sermon_band);
        this.sSong.getSongs().then((res: any) => {
          this.allSongs = res.data
            ?.map((s: any) => new Song(s))
        });
        this.sSermons.getSongsOfSermon(sermon.data.id).then((res: any) => {
          this.songs = SermonSong.mapObjects(res.data, Number(sermon.data.id));
        });
      } else {
        this.sTitle.setTitle(`Crear culto`);
        this.sermon = new Sermon();
        this.getUsers();
      }
      this.sSeries.getSeries().then((res: any) => {
        this.series = res.data
          ?.map((s: any) => new Series({ ...s, "sermons_amount": s.sermons[0].count }));
      });
    });
  }

  getUsers(sermonBands?: any[]) {
    this.sUser.getUsers().then((res: any) => {
      const users = res.data.map((u: any) => new User(u));
      this.allDirectors = users.filter((u: any) => u.direction_role);
      this.allPreachers = users.filter((u: any) => u.sermon_role);

      users.filter((u: any) => u.choir_role || u.band_role).forEach((u: any) => {
        if (sermonBands) {
          let sbId = sermonBands.find((d: any) => d.id_player == u.id)?.id ?? null;
          let sermonPlayer = new SermonBand({ id: sbId, player: u, id_sermon: this.sermon.id });
          if (sbId) this.selectedPlayers.push(sermonPlayer);
          this.allPlayers.push(sermonPlayer);
        }
      });

      this.allPlayers = [...this.allPlayers];
      this.selectedPlayers = [...this.selectedPlayers];
    });
  }

  selectSeries() {
    if (this.sermon.series && this.sermon.series.sermons_amount) {
      this.sermon.chapter_number = this.sermon.series.sermons_amount + 1;
      this.toastService.showInfoToast("Serie seleccionada", "El capítulo que sigue a esa serie es el número " + this.sermon.chapter_number + "!");
    }
  }

  addSeries() {
    let series_name = prompt('Indique el nombre de la serie');
    if (series_name) {
      try {
        this.sSeries.createSerie(series_name).then((res: any) => {
          this.sermon.series = new Series(res.data[0])
          this.series.push(new Series(res.data[0]))
          this.sermon.chapter_number = 1;
          this.toastService.showSuccessToast("Exito!", "Serie creada.");
        });
      } catch (error: any) {
        this.toastService.showErrorToast(
          "Error al guardar",
          error.error_description || error.message
        );
      }
    }
  }

  async addSermon() {
    if (!!this.datetime) {
      try {
        const sermon = this.formatSermonToSave();
        delete sermon.id;
        this.sSermons
          .createSermon(sermon)
          .then((res: any) =>
            this.router.navigateByUrl("/cultos/" + res.data[0]["id"])
          );
        this.toastService.showSuccessToast("Exito!", "Culto actualizado.");
      } catch (error: any) {
        this.toastService.showErrorToast(
          "Error al guardar",
          error.error_description || error.message
        );
      }
    } else {
      this.toastService.showErrorToast("Error", "El culto debe tener una fecha agregada.");
    }
  }

  async updateSermon() {
    if (!!this.datetime) {
      try {
        const sermon = this.formatSermonToSave();
        this.sSermons
          .updateSermon(sermon)
          .then((res: any) => {
            if (res.status && res.status == 400) {
              this.toastService.showErrorToast('Error al guardar', res.error.message);
            } else {
              this.storeBand();
            }
          });
      } catch (error: any) {
        this.toastService.showErrorToast(
          "Error al guardar",
          error.error_description || error.message
        );
      }
    } else {
      this.toastService.showErrorToast("Error", "El culto debe tener una fecha agregada.");
    }
  }

  formatSermonToSave() {
    let sermon: any = structuredClone(this.sermon);
    
    const dateValue = this.datetime.toString().split('T');
    const timeValue = dateValue[1].split(':', 2);
    sermon.datetime = `${dateValue[0]}T${Number(timeValue[0])+3}:${timeValue[1]}+00:00`

    sermon.related_series = this.sermon.series?.id ?? null;
    if (!sermon.related_series) sermon.chapter_number = null;
    sermon.id_preacher = this.sermon.preacher?.id ?? null;
    sermon.id_director = this.sermon.director?.id ?? null;
    delete sermon.time
    delete sermon.date
    delete sermon.series
    delete sermon.preacher
    delete sermon.director
    delete sermon.ids_band;
    return sermon;
  }

  storeBand() {
    const toAdd = this.selectedPlayers
      .filter((p: SermonBand) => p?.player?.id && !this.sermon.ids_band?.includes(p.player.id))
      .map((p: SermonBand) => { return { id_sermon: p.id_sermon, id_player: p.player?.id } });
    const idsSelected = this.selectedPlayers.map(sb => sb?.id);
    const toDelete = this.allPlayers.filter((p: SermonBand) => p?.id && !idsSelected.includes(p.id)).map(sb => sb.id);

    if (toAdd.length || toDelete.length) {
      try {
        this.sSermons.updateSermonBands(toAdd, toDelete).then((res: any) => {
          if (res[0].status?.toString()[0] == 2 && (res.length == 1 || res[1].status?.toString()[0])) {
            this.toastService.showSuccessToast("Exito!", "Culto actualizado.");
            this.router.navigateByUrl("/cultos/" + this.sermon.id);
          } else {
            this.toastService.showErrorToast("Error al guardar", "Algunos datos no pudieron ser guardados.");
          }
        });
      } catch (error: any) {
        this.toastService.showErrorToast(
          "Error al guardar",
          error.error_description || error.message
        );
      }
    } else {
      this.toastService.showSuccessToast("Exito!", "Culto actualizado.");
      this.router.navigateByUrl("/cultos/" + this.sermon.id);
    }
  }

  songAdded() {
    if (this.selectedSong) {
      try {
        this.sSermons.addSermonSong({ 'id_song': this.selectedSong.id, 'id_sermon': this.sermon.id }).then((res: any) => {
          this.songs.push(SermonSong.mapObjects([{ 'id': res.data[0]['id'], 'songs': this.selectedSong }], Number(this.sermon.id))[0]);
          this.toastService.showSuccessToast("Exito!", "Canción agregada.");
          this.selectedSong = null;
        });
      } catch (error: any) {
        this.toastService.showErrorToast(
          "Error al agregar canción",
          error.error_description || error.message
        );
      }
    }
  }

  songDeleted(ssID: number) {
    try {
      this.sSermons.removeSermonSong(ssID).then((res) => {
        this.toastService.showSuccessToast("Exito!", "Canción eliminada.");
        this.songs = this.songs.filter(ss => ss.id != ssID);
      });
    } catch (error: any) {
      this.toastService.showErrorToast(
        "Error al eliminar",
        error.error_description || error.message
      );
    }
  }

  customSearchSongs(term: string, item: Song) {
    term = term.toLowerCase();
    const normalizedTitle = Utils.removeAccents(item.title?.toLowerCase() ?? '');
    const normalizedBeginning = Utils.removeAccents(item.beginning?.toLowerCase() ?? '');
    const normalizedTerm = Utils.removeAccents(term);
    const all_words = (this_word: any) => this_word;
    return normalizedTitle.includes(normalizedTerm) || normalizedBeginning.includes(normalizedTerm) || item.index?.toString() == term;
  }

  groupBand = (item: any) => item.player.band_role ? 'Músicos' : 'Coro';
}
