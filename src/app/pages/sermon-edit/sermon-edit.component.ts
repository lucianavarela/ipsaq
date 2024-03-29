import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
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

@Component({
  selector: "app-sermon-edit",
  templateUrl: "./sermon-edit.component.html",
  styleUrls: ["./sermon-edit.component.scss"],
})
export class SermonEditComponent implements OnInit {
  @ViewChild(NgSelectComponent) ngSelectComponent!: NgSelectComponent;
  sermon!: Sermon;
  series: Series[] = [];
  songs: SermonSong[] = [];
  allSongs: Song[] = [];
  selectedSong!: Song;

  constructor(
    private sSermons: SermonsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService,
    private sSeries: SeriesService,
    private sSong: SongsService,
    private sTitle: Title
  ) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ sermon }) => {
      if (sermon) {
        this.sermon = new Sermon(sermon.data);
        this.sTitle.setTitle(`Editar Culto ${this.sermon.title?'"'+this.sermon.title+'"':this.sermon.date ? 'del '  + new Date(this.sermon.date).toLocaleDateString() : ''}`);
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
      }
      this.sSeries.getSeries().then((res: any) => {
        this.series = res.data
          ?.map((s: any) => new Series(s));
      });
    });
  }

  addSeries() {
    let series_name = prompt('Indique el nombre de la serie');
    if (series_name) {
      try {
        this.sSeries.createSerie(series_name).then((res: any) => {
          this.sermon.series = new Series(res.data[0])
          this.series.push(new Series(res.data[0]))
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

  async updateSermon() {
    try {
      let sermon: any = structuredClone(this.sermon);
      sermon.related_series = this.sermon.series ? this.sermon.series?.id : null;
      if (!sermon.related_series) sermon.chapter_number = null;
      delete sermon.series;
      this.sSermons
        .updateSermon(sermon)
        .then((res: any) => {
          if (res.status && res.status == 400) {
            this.toastService.showErrorToast('Error al guardar', res.error.message);
          } else {
            this.toastService.showSuccessToast("Exito!", "Culto actualizado.");
            this.router.navigateByUrl("/cultos/" + res.data[0]["id"])
          }
      });
    } catch (error: any) {
      this.toastService.showErrorToast(
        "Error al guardar",
        error.error_description || error.message
      );
    }
  }

  async addSermon() {
    try {
      let sermon: any = structuredClone(this.sermon);
      sermon.related_series = this.sermon.series?.id;
      delete sermon.series;
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
  }

  songAdded() {
    if (this.selectedSong) {
      try {
        this.sSermons.addSermonSong({ 'id_song': this.selectedSong.id, 'id_sermon': this.sermon.id }).then((res: any) => {
          this.songs.push(SermonSong.mapObjects([{ 'id': res.data[0]['id'], 'songs': this.selectedSong }], Number(this.sermon.id))[0]);
          this.toastService.showSuccessToast("Exito!", "Canción agregada.");
          this.ngSelectComponent.clearModel();
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
    term = Utils.removeAccents(term).toLowerCase();
    let splitTerm = term.split(' ').filter(t => t);
    let isWordThere: any = [];
    splitTerm.forEach(arr_term => {
      let search = Utils.removeAccents(`${item.index} ${item.beginning} ${item.title}`).toLowerCase();
      isWordThere.push(search.indexOf(arr_term) != -1);
    });
    const all_words = (this_word: any) => this_word;
    return isWordThere.every(all_words);
  }
}
