import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { SermonDetailComponent } from './pages/sermon-detail/sermon-detail.component';
import { SermonEditComponent } from './pages/sermon-edit/sermon-edit.component';
import { SermonsComponent } from './pages/sermons/sermons.component';
import { SongDetailComponent } from './pages/song-detail/song-detail.component';
import { SongEditComponent } from './pages/song-edit/song-edit.component';
import { SongsComponent } from './pages/songs/songs.component';

const AppRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'cultos', component: SermonsComponent },
  { path: 'cultos/:id', component: SermonDetailComponent },
  { path: 'cultos/:id/editar', component: SermonEditComponent },
  { path: 'cancionero', component: SongsComponent },
  { path: 'cancionero/agregar', component: SongDetailComponent },
  { path: 'cancionero/:id', component: SongDetailComponent },
  { path: 'cancionero/:id/editar', component: SongEditComponent },
  
  // otherwise redirect to home
  { path: '**', redirectTo: '' }

];

@NgModule({
  imports: [RouterModule.forRoot(AppRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
