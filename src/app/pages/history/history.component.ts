import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  constructor(private sTitle: Title) { }

  ngOnInit(): void {
    this.sTitle.setTitle(`Historia`);
  }

}
