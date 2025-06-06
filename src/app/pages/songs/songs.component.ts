import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import { Song } from 'src/app/classes/song';
import { SongsService } from 'src/app/services/songs.service';
import { SupabaseService } from 'src/app/services/supabase.service';
import { Title } from '@angular/platform-browser';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HighlightDirective } from 'src/app/decorators/highlight.directive';
import { TextFoundPipe } from 'src/app/decorators/text-found.pipe';
import { HeaderComponent } from 'src/app/utils/header/header.component';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatTooltipModule,
    NgClass,
    DatePipe,
    HighlightDirective,
    TextFoundPipe,
    HeaderComponent
  ]
})

export class SongsComponent implements OnInit {
  searchedText: string = '';
  displayedColumns: string[] = ['index', 'beginning', 'lyrics_and_chords'];
  songs: Song[] = [];
  dataSource!: MatTableDataSource<Song>;
  @ViewChild(MatSort) sort!: MatSort;
  isMobile = false;

  constructor(private sSong: SongsService, private router: Router, private readonly supabase: SupabaseService,
    private sTitle: Title) {
    this.isMobile = window.innerWidth <= 767;
  }

  ngOnInit(): void {
    if (this.router.url.indexOf('ultimas_canciones') > -1) {
      this.sTitle.setTitle('Ultimas Canciones');
      this.sSong.getLatestSongs().then(res => {
        if (res.data) this.songs = res.data.map((o: any) => new Song(o))
        this.initializeTable();
      });
    } else if (this.router.url.indexOf('canciones_sugeridas') > -1) {
      this.sTitle.setTitle('Canciones Sugeridas');
      this.displayedColumns = ['beginning', 'lyrics_and_chords'];
      this.sSong.getSuggestedSongs().then(res => {
        if (res.data) this.songs = res.data.map((o: any) => new Song(o))
        this.initializeTable();
      });
    } else {
      this.sTitle.setTitle('Cancionero');
      if (this.isLoggedIn() && !this.isMobile) {
        this.displayedColumns = ['index', 'beginning', 'last_used', 'amount_used', 'link_ipsaq', 'lyrics_and_chords'];
      }
      this.sSong.getSongs(true).then(res => {
        if (res.data) this.songs = res.data.map((o: any) => new Song(o))
        this.initializeTable();
      });
    }
  }

  isLoggedIn() {
    return this.supabase.isLoggedIn();
  }

  initializeTable() {
    this.dataSource = new MatTableDataSource(this.songs);
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (data: Song, filter: string): boolean => {
      const dataStr = Object.keys(data).reduce((currentTerm: string, key: string) => {
        return (currentTerm + (data as { [key: string]: any })[key] + '◬');
      }, '').normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
      const transformedFilter = filter.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      return dataStr.indexOf(transformedFilter) != -1;
    }
  }

  applyFilter() {
    this.dataSource.filter = this.searchedText.trim().normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  }

  lyricsMatch(lyrics: string) {
    if (!this.searchedText) return false;
    const normalizedText = lyrics.normalize("NFD").replace(/\p{Diacritic}/giu, "");
    const term = this.searchedText.normalize("NFD").replace(/\p{Diacritic}/giu, "");
    const regex = new RegExp(`${term}`, "gi");
    return !!normalizedText.match(regex)
  }
}
