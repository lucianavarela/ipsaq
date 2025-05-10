import { Component, Inject, OnInit } from '@angular/core';
import { Sermon } from 'src/app/classes/sermon';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { SafeUrlPipe } from 'src/app/decorators/safe-url.pipe';
import { TransformYoutubePipe } from 'src/app/decorators/transform-youtube.pipe';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-live-sermon',
  templateUrl: './live-sermon.component.html',
  styleUrls: ['./live-sermon.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    SafeUrlPipe,
    TransformYoutubePipe,
    RouterLink,
    MatIconModule
  ]
})
export class LiveSermonComponent implements OnInit {
  sermon!: Sermon;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.sermon = this.data.sermon;
  }

}
