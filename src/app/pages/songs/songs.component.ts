import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Song } from 'src/app/classes/song';
import { SongsService } from 'src/app/services/songs.service';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss']
})

export class SongsComponent implements OnInit {
  displayedColumns: string[] = ['index', 'beginning', 'title', 'last_used', 'amount_used', 'link_ipsaq', 'button_to_page'];
  songs: Song[] = [];
  dataSource = new MatTableDataSource<Song>();
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(private sSong: SongsService, private _liveAnnouncer: LiveAnnouncer) { }
  
  ngOnInit(): void {
    this.sSong.getSongs(true).then(res => {
      if (res.data) this.songs = res.data.map(o => new Song(o))
      this.dataSource = new MatTableDataSource(this.songs);
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
