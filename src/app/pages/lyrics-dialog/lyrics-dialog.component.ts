import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Song } from 'src/app/classes/song';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lyrics-dialog',
  templateUrl: './lyrics-dialog.component.html',
  styleUrl: './lyrics-dialog.component.scss',
  standalone: true,
  imports: [CommonModule]
})
export class LyricsDialogComponent {
  song!: Song

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.song = this.data.song;
  }
}
