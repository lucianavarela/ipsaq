import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR';

// Material
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';

// Components
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SongsComponent } from './pages/songs/songs.component';
import { SongDetailComponent } from './pages/song-detail/song-detail.component';
import { SongEditComponent } from './pages/song-edit/song-edit.component';
import { SermonsComponent } from './pages/sermons/sermons.component';
import { SermonDetailComponent } from './pages/sermon-detail/sermon-detail.component';
import { SermonEditComponent } from './pages/sermon-edit/sermon-edit.component';
import { FormsModule } from '@angular/forms';
import { SafeUrlPipe } from './decorators/safe-url.pipe';
import { TransformYoutubePipe } from './decorators/transform-youtube.pipe';
import { ToasterComponent } from './utils/toaster/toaster.component';
import { ToastComponent } from './utils/toast/toast.component';
import { SongsBoxComponent } from './pages/songs-box/songs-box.component';
import { SermonBoxComponent } from './pages/sermon-box/sermon-box.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ResetPwComponent } from './pages/reset-pw/reset-pw.component';
import { ContactComponent } from './pages/contact/contact.component';
import { LocationComponent } from './pages/location/location.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { TextFoundPipe } from './decorators/text-found.pipe';
import { HighlightDirective } from './decorators/highlight.directive';
import { SongSuggestionComponent } from './pages/song-suggestion/song-suggestion.component';
import { HistoryComponent } from './pages/history/history.component';
import { BeliefsComponent } from './pages/beliefs/beliefs.component';
import { GovernmentComponent } from './pages/government/government.component';
import { LiveSermonComponent } from './pages/live-sermon/live-sermon.component';
import { NoAccentsPipe } from './decorators/no-accents.pipe';
import { SeriesComponent } from './pages/series/series.component';
import { SerieDetailComponent } from './pages/serie-detail/serie-detail.component';
import { HeaderComponent } from './utils/header/header.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { AniversaryComponent } from './pages/aniversary/aniversary.component';
import { CommentBoxComponent } from './pages/comment-box/comment-box.component';
import { LyricsDialogComponent } from './pages/lyrics-dialog/lyrics-dialog.component';
import { AniversaryFeedComponent } from './pages/aniversary-feed/aniversary-feed.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PageButtonComponent } from './utils/page-button/page-button.component';
import { DownloadsComponent } from './pages/downloads/downloads.component';
import { PlanningComponent } from './pages/planning/planning.component';

registerLocaleData(localeEsAr, 'es-Ar');

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SongsComponent,
    SongDetailComponent,
    SongEditComponent,
    SongSuggestionComponent,
    SermonsComponent,
    SermonDetailComponent,
    SermonEditComponent,
    SafeUrlPipe,
    TransformYoutubePipe,
    TextFoundPipe,
    ToasterComponent,
    ToastComponent,
    SongsBoxComponent,
    SermonBoxComponent,
    ResetPwComponent,
    ContactComponent,
    LocationComponent,
    HighlightDirective,
    HistoryComponent,
    BeliefsComponent,
    GovernmentComponent,
    LiveSermonComponent,
    NoAccentsPipe,
    SeriesComponent,
    SerieDetailComponent,
    HeaderComponent,
    ScheduleComponent,
    AniversaryComponent,
    CommentBoxComponent,
    LyricsDialogComponent,
    AniversaryFeedComponent,
    PageButtonComponent,
    DownloadsComponent,
    PlanningComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    MatTableModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatSortModule,
    MatSelectModule,
    NgSelectModule,
    GoogleMapsModule,
    MatTooltipModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatChipsModule,
    MatPaginatorModule,
    MatAccordion,
    MatExpansionModule
  ],
  providers: [NoAccentsPipe,
    { provide: LOCALE_ID, useValue: 'es-Ar' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
