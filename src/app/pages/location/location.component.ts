import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {
  marker: any;

  constructor() {
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
  }

}
