import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from 'src/app/utils/header/header.component';

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.component.html',
  styleUrl: './downloads.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent
  ]
})

export class DownloadsComponent {
  constructor() {

  }


}
