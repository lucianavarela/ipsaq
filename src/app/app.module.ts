import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {MatTableModule} from '@angular/material/table';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { SongsComponent } from './pages/songs/songs.component';
import { SongDetailComponent } from './pages/song-detail/song-detail.component';
import { SongEditComponent } from './pages/song-edit/song-edit.component';
import { SermonsComponent } from './pages/sermons/sermons.component';
import { SermonDetailComponent } from './pages/sermon-detail/sermon-detail.component';
import { SermonEditComponent } from './pages/sermon-edit/sermon-edit.component';
import { SermonSermon } from './services/sermons.service';
import { SongsSermon } from './services/songs.service';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    SongsComponent,
    SongDetailComponent,
    SongEditComponent,
    SermonsComponent,
    SermonDetailComponent,
    SermonEditComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    MatTableModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
