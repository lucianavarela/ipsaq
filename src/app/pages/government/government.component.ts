import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from 'src/app/utils/header/header.component';

@Component({
  selector: 'app-government',
  templateUrl: './government.component.html',
  styleUrls: ['./government.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent
  ]
})
export class GovernmentComponent implements OnInit {

  constructor(private sTitle: Title) { }

  ngOnInit(): void {
    this.sTitle.setTitle(`Forma de gobierno`);
  }

}
