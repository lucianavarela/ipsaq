import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Comment } from 'src/app/classes/comment';
import { Sermon } from 'src/app/classes/sermon';
import { Song } from 'src/app/classes/song';
import { CommentsService } from 'src/app/services/comments.service';
import { SermonsService } from 'src/app/services/sermons.service';
import { SupabaseService } from 'src/app/services/supabase.service';
import { ToastService } from 'src/app/services/toast.service';
import { LyricsDialogComponent } from '../lyrics-dialog/lyrics-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-aniversary',
  templateUrl: './aniversary.component.html',
  styleUrls: ['./aniversary.component.scss']
})
export class AniversaryComponent implements OnInit {
  isMobile = false;
  comments: Comment[] = [];
  newComment!: Comment;
  songs: Song[] = [];

  constructor(private sTitle: Title, private supabase: SupabaseService, private sComments: CommentsService,
    private toastService: ToastService, private sSermons: SermonsService, public dialog: MatDialog) {
    this.newComment = new Comment();
    this.isMobile = window.innerWidth <= 767;
  }

  ngOnInit(): void {
    this.sTitle.setTitle(`100 Aniversario`);
    this.sComments.getComments().then(res => {
      if (res.data) this.comments = res.data.map((c: any) => new Comment(c))
    });
    this.sSermons.getSongsOfSermon(313).then((res: any) => {
      this.songs = res.data.map((s: any) => new Song(s.songs));
    });
  }

  isLoggedIn() {
    return this.supabase.isLoggedIn();
  }

  saveComment() {
    if (this.newComment.message) {
      let commentToAdd: any = structuredClone(this.newComment);
      delete commentToAdd.id
      delete commentToAdd.created_at
      this.sComments.createComment(commentToAdd).then((res: any) => {
        this.toastService.showSuccessToast("Exito!", "Comentario agregado!");
        this.comments.unshift(new Comment(res.data[0]));
        this.newComment = new Comment();
      });
    } else {
      this.toastService.showErrorToast("Error", "El mensaje está vacio!");
    }
  }

  removeComment(id: number) {
    this.comments = this.comments.filter(c => c.id != id);
  }

  openLyrics(song: Song) {
    this.dialog.open(LyricsDialogComponent, {
      width: this.isMobile ? '70%' : '40%', height: '80%',
      data: { song: song }
    });
  }
}
