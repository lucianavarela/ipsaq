import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Sermon } from 'src/app/classes/sermon';
import { SermonsService } from 'src/app/services/sermons.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-sermon-detail',
  templateUrl: './sermon-detail.component.html',
  styleUrls: ['./sermon-detail.component.scss']
})
export class SermonDetailComponent implements OnInit {
  sermon!: Sermon;
  loading = false;

  constructor(private sSermons: SermonsService, private activatedRoute: ActivatedRoute, private _sanitizer: DomSanitizer) {
  }
  ngOnInit() {
    this.activatedRoute.data.subscribe(({ sermon }) => {
      this.sermon = new Sermon(sermon.data);
    })
  }
  
}
