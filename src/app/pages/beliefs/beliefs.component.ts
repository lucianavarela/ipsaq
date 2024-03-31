import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-beliefs',
  templateUrl: './beliefs.component.html',
  styleUrls: ['./beliefs.component.scss']
})
export class BeliefsComponent implements OnInit {

  constructor(private sTitle: Title) { }

  ngOnInit(): void {
    this.sTitle.setTitle(`¿En qué creemos?`);
  }

}
