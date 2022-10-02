import { Component, OnInit } from '@angular/core';
import { Sermon } from 'src/app/classes/sermon';
import { SermonsService } from 'src/app/services/sermons.service';
import { ActivatedRoute, Router } from '@angular/router';
import Utils from "src/app/utils/utils";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  lastSermon!: Sermon;
  upcomingSermon!: Sermon;
  sermonIsLive: boolean = false;

  constructor(private sSermon: SermonsService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    if (this.route.root.snapshot.fragment && this.route.root.snapshot.fragment.indexOf('type=recovery') > -1) {
      let access_token = this.route.root.snapshot.fragment.match(/access_token\=([^&]+)/);
      if (access_token) this.router.navigate(["/reset"], {queryParams: {'access_token': access_token[1]}})
    }
    this.sSermon.getSpecificSermon(true).then((res:any) => this.lastSermon = new Sermon(res.data[0]))
    this.sSermon.getSpecificSermon(false).then((res:any) => {
      this.upcomingSermon = new Sermon(res.data[0]);
      const today = new Date();
      if (
        this.upcomingSermon?.date && 
        this.upcomingSermon?.date.toString() == Utils.getToday()
        ) {
        this.sermonIsLive = true;
      }
    });
  }
}

