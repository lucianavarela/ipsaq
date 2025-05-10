import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { HeaderComponent } from 'src/app/utils/header/header.component';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
  standalone: true,
  imports: [CommonModule, GoogleMapsModule, HeaderComponent]
})
export class LocationComponent implements OnInit {
  marker: any;

  constructor(private sTitle: Title) {
    this.marker = {
      position: {
        lat: -34.72524442682835,
        lng: -58.253858620716024,
      },
      title: 'Marker title ',
      options: { 
        icon: {url: 'assets/church-icon.png', scaledSize: {height: 50, width: 50}},
       },
    };
  }

  ngOnInit(): void {
    this.sTitle.setTitle(`¿Dónde estámos?`);
  }

}
