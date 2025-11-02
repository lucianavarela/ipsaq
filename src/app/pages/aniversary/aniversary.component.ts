import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { MatPaginatorIntl, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { PaginatorIntl } from 'src/app/services/paginatorIntl.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SafeUrlPipe } from 'src/app/decorators/safe-url.pipe';
import { TransformYoutubePipe } from 'src/app/decorators/transform-youtube.pipe';
import { CommentBoxComponent } from '../comment-box/comment-box.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-aniversary',
  templateUrl: './aniversary.component.html',
  styleUrls: ['./aniversary.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorIntl }],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatPaginatorModule,
    SafeUrlPipe,
    TransformYoutubePipe,
    CommentBoxComponent
  ]
})
export class AniversaryComponent implements OnInit {
  @ViewChild('comments_gallery') commentsGalleryRef!: ElementRef;
  aniversaryVideo = "https://www.youtube.com/watch?v=1mgVp20uEFI";
  isLoggedIn = false;
  private authSub?: Subscription;
  isMobile = false;
  comments: Comment[] = [];
  currentCommentsToShow: Comment[] = [];
  newComment!: Comment;
  songs: Song[] = [];
  currentPage = 0;
  pageSize = 5;

  constructor(private sTitle: Title, private supabase: SupabaseService, private sComments: CommentsService,
    private toastService: ToastService, private sSermons: SermonsService, public dialog: MatDialog) {
    this.newComment = new Comment();
    this.isMobile = window.innerWidth <= 767;
  }

  ngOnInit(): void {
    this.authSub = this.supabase.authState$.subscribe(val => {
      this.isLoggedIn = val === true;
    });
    this.sTitle.setTitle(`100 Aniversario`);
    this.sComments.getComments().then(res => {
      if (res.data) {
        this.comments = res.data.map((c: any) => new Comment(c));
        this.currentCommentsToShow = this.comments.slice(this.currentPage * this.pageSize, this.currentPage * this.pageSize + this.pageSize);
      }
    });
    this.sSermons.getSongsOfSermon(313).then((res: any) => {
      this.songs = res.data.map((s: any) => new Song(s.songs));
    });
  }

  ngOnDestroy() {
    this.authSub?.unsubscribe();
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
        this.currentPage = 0;
        this.handlePageEvent();
      });
    } else {
      this.toastService.showErrorToast("Error", "El mensaje está vacio!");
    }
  }

  removeComment(id: number) {
    this.comments = this.comments.filter(c => c.id != id);
    this.currentCommentsToShow = this.currentCommentsToShow.filter(c => c.id != id);
  }

  openLyrics(song: Song) {
    this.dialog.open(LyricsDialogComponent, {
      width: this.isMobile ? '70%' : '40%', height: '80%',
      data: { song: song }
    });
  }

  handlePageEvent(pageEvent?: PageEvent) {
    if (pageEvent) this.currentPage = pageEvent.pageIndex;
    this.currentCommentsToShow = this.comments.slice(this.currentPage * this.pageSize, this.currentPage * this.pageSize + this.pageSize);
    this.commentsGalleryRef.nativeElement.scrollIntoView();
  }
}
