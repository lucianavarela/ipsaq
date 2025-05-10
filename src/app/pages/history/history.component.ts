import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from 'src/app/utils/header/header.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    RouterLink
  ]
})
export class HistoryComponent implements OnInit {

  constructor(private sTitle: Title) { }

  ngOnInit(): void {
    this.sTitle.setTitle(`Historia`);
  }

}
