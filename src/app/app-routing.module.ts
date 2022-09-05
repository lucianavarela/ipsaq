import { NgModule } from '@angular/core';
import { RouterModule, Routes, UrlSegment } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ResetPwComponent } from './pages/reset-pw/reset-pw.component';
import { SermonDetailComponent } from './pages/sermon-detail/sermon-detail.component';
import { SermonEditComponent } from './pages/sermon-edit/sermon-edit.component';
import { SermonsComponent } from './pages/sermons/sermons.component';
import { SongDetailComponent } from './pages/song-detail/song-detail.component';
import { SongEditComponent } from './pages/song-edit/song-edit.component';
import { SongsComponent } from './pages/songs/songs.component';
import { SermonsResolverService } from './services/sermons-resolver.service';
import { SongsResolverService } from './services/songs-resolver.service';

const AppRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'entrar', component: LoginComponent },
  { path: 'reset', component: ResetPwComponent },
  { path: 'cultos', component: SermonsComponent },
  {
    path: 'cultos/:id',
    component: SermonDetailComponent,
    resolve: {
      sermon: SermonsResolverService
    }
  },
  {
    path: 'cultos/:id/editar',
    component: SermonEditComponent,
    resolve: {
      sermon: SermonsResolverService
    }
  },
  { path: 'nuevo_culto', component: SermonEditComponent },
  { path: 'cancionero', component: SongsComponent },
  { path: 'nueva_cancion', component: SongEditComponent },
  { 
    path: 'cancionero/:id',
    component: SongDetailComponent,
    resolve: {
      song: SongsResolverService
    }
  },
  {
    path: 'cancionero/:id/editar',
    component: SongEditComponent,
    resolve: {
      song: SongsResolverService
    }
  },
  
  // otherwise redirect to home
  { path: '**', redirectTo: '' }

];

@NgModule({
  imports: [RouterModule.forRoot(AppRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
