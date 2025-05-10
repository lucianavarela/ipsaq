import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from 'src/app/utils/header/header.component';

@Component({
  selector: 'app-beliefs',
  templateUrl: './beliefs.component.html',
  styleUrls: ['./beliefs.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent
  ]
})
export class BeliefsComponent implements OnInit {

  constructor(private sTitle: Title) { }

  ngOnInit(): void {
    this.sTitle.setTitle(`¿En qué creemos?`);
  }

}
