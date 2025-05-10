import { Component, OnInit } from '@angular/core';
import { Sermon } from 'src/app/classes/sermon';
import { SermonsService } from 'src/app/services/sermons.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import Utils from 'src/app/utils/utils';
import { SafeUrlPipe } from 'src/app/decorators/safe-url.pipe';
import { TransformYoutubePipe } from 'src/app/decorators/transform-youtube.pipe';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    DatePipe, 
    RouterLink, 
    NgFor, 
    NgIf,
    SafeUrlPipe,
    TransformYoutubePipe
  ]
})
export class HomeComponent implements OnInit {
  lastsSermons!: Sermon[];
  today!: any;
  tomorrow!: any;

  constructor(private sSermon: SermonsService, private route: ActivatedRoute, private router: Router, private sTitle: Title) { }

  ngOnInit(): void {
    this.sTitle.setTitle(`Presbi Quilmes`);

    this.today = Utils.getTheDate('today');
    this.tomorrow = Utils.getTheDate('tomorrow');

    this.sSermon.getLastsSermons().then((res:any) => {
      this.lastsSermons = res.data.map((s:any) => new Sermon(s));
    });
  }
}

