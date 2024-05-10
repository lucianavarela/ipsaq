import { Component, OnInit } from '@angular/core';
import { Sermon } from 'src/app/classes/sermon';
import { SermonsService } from 'src/app/services/sermons.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import Utils from 'src/app/utils/utils';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
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

    if (this.route.root.snapshot.fragment && this.route.root.snapshot.fragment.indexOf('type=recovery') > -1) {
      let access_token = this.route.root.snapshot.fragment.match(/access_token\=([^&]+)/);
      if (access_token) this.router.navigate(["/reset"], {queryParams: {'access_token': access_token[1]}})
    }

    this.sSermon.getLastsSermons().then((res:any) => {
      this.lastsSermons = res.data.map((s:any) => new Sermon(s));
    });
  }
}

