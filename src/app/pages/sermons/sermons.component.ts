import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { Sermon } from 'src/app/classes/sermon';
import { SermonsService } from 'src/app/services/sermons.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { HighlightDirective } from 'src/app/decorators/highlight.directive';
import { HeaderComponent } from 'src/app/utils/header/header.component';

@Component({
  selector: 'app-sermons',
  templateUrl: './sermons.component.html',
  styleUrls: ['./sermons.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    RouterLink,
    HighlightDirective,
    HeaderComponent
  ]
})

export class SermonsComponent implements OnInit {
  searchedText: string = '';
  displayedColumns: string[] = ['title', 'date', 'bible', 'info', 'button_to_page'];
  sermons: Sermon[] = [];
  dataSource = new MatTableDataSource<Sermon>();
  @ViewChild(MatSort) sort!: MatSort;
  isMobile = false;
  expandedElement!: Sermon | null;

  constructor(private sSermon: SermonsService, private _liveAnnouncer: LiveAnnouncer, private sTitle: Title) {
    this.isMobile = window.innerWidth <= 767;
    if (this.isMobile) this.displayedColumns = ['title', 'expand'];
  }

  ngOnInit(): void {
    this.sTitle.setTitle(`Cultos`);
    this.sSermon.getSermons().then(res => {
      if (res.data) this.sermons = res.data.map((o: any) => new Sermon(o));
      this.initializeTable();
    });
  }

  initializeTable() {
    this.dataSource = new MatTableDataSource(this.sermons);
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (data: Sermon, filter: string): boolean => {
      const dataStr = Object.keys(data).reduce((currentTerm: string, key: string) => {
        return (currentTerm + (data as { [key: string]: any })[key] + '◬');
      }, '').normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
      const transformedFilter = filter.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      return dataStr.indexOf(transformedFilter) != -1;
    }
  }

  applyFilter() {
    this.dataSource.filter = this.searchedText.trim().normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  }
}
