import { Component, OnInit } from '@angular/core';
import { Sermon } from 'src/app/classes/sermon';
import { SermonsService } from 'src/app/services/sermons.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  lastSermon!: Sermon;
  upcomingSermon!: Sermon;
  constructor(private sSermon: SermonsService) { }

  ngOnInit(): void {
    this.sSermon.getSpecificSermon(true).then((res:any) => this.lastSermon = new Sermon(res.data[0]))
    this.sSermon.getSpecificSermon(false).then((res:any) => this.upcomingSermon = new Sermon(res.data[0]))
  }
}
