import { Component, Input, OnInit } from '@angular/core';
import { Sermon } from 'src/app/classes/sermon';

@Component({
  selector: 'app-sermon-box',
  templateUrl: './sermon-box.component.html',
  styleUrls: ['./sermon-box.component.scss']
})
export class SermonBoxComponent implements OnInit {
  @Input('sermonInput') sermon!: Sermon | undefined;

  constructor() { }

  ngOnInit(): void {
  }
}
