import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Song } from 'src/app/classes/song';
import { SongsService } from 'src/app/services/songs.service';
import { SupabaseService } from 'src/app/services/supabase.service';
import { Title } from '@angular/platform-browser';
import Utils from 'src/app/utils/utils';
import { normalize } from 'path';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss']
})

export class SongsComponent implements OnInit {
  searchedText: string = '';
  displayedColumns: string[] = ['index', 'beginning', 'lyrics_and_chords'];
  songs: Song[] = [];
  dataSource!: MatTableDataSource<Song>;
  @ViewChild(MatSort) sort!: MatSort;
  isMobile = false;
  isLoggedIn = false;
  
  constructor(private sSong: SongsService, private router: Router, private readonly supabase: SupabaseService,
    private sTitle: Title) {
      this.isMobile = window.innerWidth <= 767;
    }
  
  ngOnInit(): void {
    this.isLoggedIn = !!(this.supabase.isLoggedIn());
    if (this.router.url.indexOf('ultimas_canciones') > -1) {
      this.sTitle.setTitle('Ultimas Canciones');
      this.sSong.getLatestSongs().then(res => {
        if (res.data) this.songs = res.data.map((o:any) => new Song(o))
        this.initializeTable();
      });
    } else if (this.router.url.indexOf('canciones_sugeridas') > -1) {
      this.sTitle.setTitle('Canciones Sugeridas');
      this.displayedColumns = ['beginning', 'lyrics_and_chords'];
      this.sSong.getSuggestedSongs().then(res => {
        if (res.data) this.songs = res.data.map((o:any) => new Song(o))
        this.initializeTable();
      });
    } else{
      this.sTitle.setTitle('Cancionero');
      if (this.supabase.isLoggedIn() && !this.isMobile) {
        this.displayedColumns = ['index', 'beginning', 'last_used', 'amount_used', 'link_ipsaq', 'lyrics_and_chords'];
      }
      this.sSong.getSongs(true).then(res => {
        if (res.data) this.songs = res.data.map((o:any) => new Song(o))
        this.initializeTable();
      });
    }
    
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
