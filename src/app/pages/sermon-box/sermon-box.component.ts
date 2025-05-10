import { Component, Input, OnInit } from '@angular/core';
import { Sermon } from 'src/app/classes/sermon';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sermon-box',
  templateUrl: './sermon-box.component.html',
  styleUrls: ['./sermon-box.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe]
})
export class SermonBoxComponent implements OnInit {
  @Input('sermonInput') sermon!: Sermon | undefined;

  constructor() { }

  ngOnInit(): void {
  }
}
