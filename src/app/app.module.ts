import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {MatTableModule} from '@angular/material/table';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { ToasterComponent } from './utils/toaster/toaster.component';
import { ToastComponent } from './utils/toast/toast.component';
import { SongsBoxComponent } from './pages/songs-box/songs-box.component';
import { MatSelectModule } from '@angular/material/select';
import { NgSelectModule } from '@ng-select/ng-select';
import { ResetPwComponent } from './pages/reset-pw/reset-pw.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SongsComponent,
    SongDetailComponent,
    SongEditComponent,
    SermonsComponent,
    SermonDetailComponent,
    SermonEditComponent,
    SafeUrlPipe,
    TransformYoutubePipe,
    ToasterComponent,
    ToastComponent,
    SongsBoxComponent,
    ResetPwComponent,
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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
