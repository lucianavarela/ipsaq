import { NgModule } from "@angular/core";
import { RouterModule, Routes, UrlSegment } from "@angular/router";
import { AuthGuard } from "./guards/auth.guard";
import { BeliefsComponent } from "./pages/beliefs/beliefs.component";
import { ContactComponent } from "./pages/contact/contact.component";
import { GovernmentComponent } from "./pages/government/government.component";
import { HistoryComponent } from "./pages/history/history.component";
import { HomeComponent } from "./pages/home/home.component";
import { LocationComponent } from "./pages/location/location.component";
import { LoginComponent } from "./pages/login/login.component";
import { ResetPwComponent } from "./pages/reset-pw/reset-pw.component";
import { SerieDetailComponent } from "./pages/serie-detail/serie-detail.component";
import { SeriesComponent } from "./pages/series/series.component";
import { SermonDetailComponent } from "./pages/sermon-detail/sermon-detail.component";
import { SermonEditComponent } from "./pages/sermon-edit/sermon-edit.component";
import { SermonsComponent } from "./pages/sermons/sermons.component";
import { SongDetailComponent } from "./pages/song-detail/song-detail.component";
import { SongEditComponent } from "./pages/song-edit/song-edit.component";
import { SongSuggestionComponent } from "./pages/song-suggestion/song-suggestion.component";
import { SongsComponent } from "./pages/songs/songs.component";
import { SeriesResolverService } from "./services/series-resolver.service";
import { SermonsResolverService } from "./services/sermons-resolver.service";
import { SongsResolverService } from "./services/songs-resolver.service";
import { SuggestedSongsResolverService } from "./services/suggested-songs-resolver.service";
import { ScheduleComponent } from "./pages/schedule/schedule.component";
import { AniversaryComponent } from "./pages/aniversary/aniversary.component";
import { AniversaryFeedComponent } from "./pages/aniversary-feed/aniversary-feed.component";

const AppRoutes: Routes = [
  { path: "", component: HomeComponent },
  { path: "entrar", component: LoginComponent },
  { path: "reset", component: ResetPwComponent },
  { path: "ubicacion", component: LocationComponent },
  { path: "cultos", component: SermonsComponent },
  {
    path: "cultos/:id",
    component: SermonDetailComponent,
    resolve: {
      sermon: SermonsResolverService,
    },
  },
  {
    path: "cultos/:id/editar",
    component: SermonEditComponent,
    canActivate: [AuthGuard],
    resolve: {
      sermon: SermonsResolverService,
    },
  },
  {
    path: "nuevo_culto",
    canActivate: [AuthGuard],
    component: SermonEditComponent,
  },
  { path: "series", component: SeriesComponent },
  {
    path: "series/:id",
    component: SerieDetailComponent,
    resolve: {
      serie: SeriesResolverService,
    },
  },
  { path: "cancionero", component: SongsComponent },
  { path: "ultimas_canciones", component: SongsComponent },
  { path: "sugerir_cancion", component: SongSuggestionComponent },
  {
    path: "nueva_cancion",
    canActivate: [AuthGuard],
    component: SongEditComponent,
  },
  {
    path: "cancionero/:index",
    component: SongDetailComponent,
    resolve: {
      song: SongsResolverService,
    },
  },
  {
    path: "cancionero/:index/editar",
    component: SongEditComponent,
    canActivate: [AuthGuard],
    resolve: {
      song: SongsResolverService,
    },
  },
  {
    path: "canciones_sugeridas",
    component: SongsComponent
  },
  {
    path: "canciones_sugeridas/:id",
    component: SongDetailComponent,
    resolve: {
      song: SuggestedSongsResolverService,
    },
  },
  {
    path: "canciones_sugeridas/:id/editar",
    component: SongEditComponent,
    canActivate: [AuthGuard],
    resolve: {
      song: SuggestedSongsResolverService,
    },
  },
  {
    path: "cronograma",
    canActivate: [AuthGuard],
    component: ScheduleComponent,
  },
  {
    path: "quienes-somos",
    children: [
      { path: "historia", component: HistoryComponent },
      { path: "en-que-creemos", component: BeliefsComponent },
      { path: "forma-de-gobierno", component: GovernmentComponent }
    ]
  },
  { path: "aniversario", component: AniversaryComponent },
  { path: "aniversario/feed", component: AniversaryFeedComponent },

  // otherwise redirect to home
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [RouterModule.forRoot(AppRoutes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
