import { Component, OnChanges, Inject, OnInit } from '@angular/core';
import { Sermon } from 'src/app/classes/sermon';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-live-sermon',
  templateUrl: './live-sermon.component.html',
  styleUrls: ['./live-sermon.component.scss']
})
export class LiveSermonComponent implements OnInit {
  sermon!: Sermon;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.sermon = this.data.sermon;
  }

}
