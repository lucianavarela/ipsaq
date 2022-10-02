import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Song } from 'src/app/classes/song';
import { SongsService } from 'src/app/services/songs.service';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss']
})

export class SongsComponent implements OnInit {
  searchedText: string = '';
  displayedColumns: string[] = ['index', 'beginning', 'last_used', 'amount_used', 'link_ipsaq', 'lyrics_and_chords'];
  songs: Song[] = [];
  dataSource = new MatTableDataSource<Song>();
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(private sSong: SongsService, private router: Router) { }
  
  ngOnInit(): void {
    console.log(this.router.url)
    if (this.router.url.indexOf('ultimas_canciones') > -1) {
      this.displayedColumns = ['index', 'beginning', 'lyrics_and_chords'];
      this.sSong.getLatestSongs().then(res => {
        if (res.data) this.songs = res.data.map(o => new Song(o))
        this.dataSource = new MatTableDataSource(this.songs);
        this.dataSource.sort = this.sort;
      });
    } else if (this.router.url.indexOf('canciones_sugeridas') > -1) {
      this.displayedColumns = ['beginning', 'lyrics_and_chords'];
      this.sSong.getSuggestedSongs().then(res => {
        if (res.data) this.songs = res.data.map(o => new Song(o))
        this.dataSource = new MatTableDataSource(this.songs);
        this.dataSource.sort = this.sort;
      });
    } else{
      this.sSong.getSongs(true).then(res => {
        if (res.data) this.songs = res.data.map(o => new Song(o))
        this.dataSource = new MatTableDataSource(this.songs);
        this.dataSource.sort = this.sort;
      });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
