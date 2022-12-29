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
import { SermonDetailComponent } from "./pages/sermon-detail/sermon-detail.component";
import { SermonEditComponent } from "./pages/sermon-edit/sermon-edit.component";
import { SermonsComponent } from "./pages/sermons/sermons.component";
import { SongDetailComponent } from "./pages/song-detail/song-detail.component";
import { SongEditComponent } from "./pages/song-edit/song-edit.component";
import { SongSuggestionComponent } from "./pages/song-suggestion/song-suggestion.component";
import { SongsComponent } from "./pages/songs/songs.component";
import { SermonsResolverService } from "./services/sermons-resolver.service";
import { SongsResolverService } from "./services/songs-resolver.service";

const AppRoutes: Routes = [
  { path: "", component: HomeComponent },
  { path: "entrar", component: LoginComponent },
  { path: "reset", component: ResetPwComponent },
  { path: "contacto", component: ContactComponent },
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
  { path: "cancionero", component: SongsComponent },
  { path: "ultimas_canciones", component: SongsComponent },
  { path: "sugerir_cancion", component: SongSuggestionComponent },
  {
    path: "nueva_cancion",
    canActivate: [AuthGuard],
    component: SongEditComponent,
  },
  {
    path: "canciones_sugeridas",
    canActivate: [AuthGuard],
    component: SongsComponent
  },
  {
    path: "cancionero/:id",
    component: SongDetailComponent,
    resolve: {
      song: SongsResolverService,
    },
  },
  {
    path: "cancionero/:id/editar",
    component: SongEditComponent,
    canActivate: [AuthGuard],
    resolve: {
      song: SongsResolverService,
    },
  },

  {
    path: "quienes-somos",
    children: [
      { path: "historia", component: HistoryComponent },
      { path: "en-que-creemos", component: BeliefsComponent },
      { path: "forma-de-gobierno", component: GovernmentComponent }
    ]
  },

  // otherwise redirect to home
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [RouterModule.forRoot(AppRoutes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
