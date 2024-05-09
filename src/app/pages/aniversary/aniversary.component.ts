import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Comment } from 'src/app/classes/comment';
import { Sermon } from 'src/app/classes/sermon';
import { Song } from 'src/app/classes/song';
import { CommentsService } from 'src/app/services/comments.service';
import { SermonsService } from 'src/app/services/sermons.service';
import { SupabaseService } from 'src/app/services/supabase.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-aniversary',
  templateUrl: './aniversary.component.html',
  styleUrls: ['./aniversary.component.scss']
})
export class AniversaryComponent implements OnInit {
  comments: Comment[] = [];
  newComment!: Comment;
  songs: Song[] = [];

  constructor(private sTitle: Title, private supabase: SupabaseService, private sComments: CommentsService,
    private toastService: ToastService, private sSermons: SermonsService) {
    this.newComment = new Comment();
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
    let commentToAdd: any = structuredClone(this.newComment);
    delete commentToAdd.id
    delete commentToAdd.created_at
    this.sComments.createComment(commentToAdd).then((res: any) => {
      this.toastService.showSuccessToast("Exito!", "Comentario agregado!");
      this.comments.unshift(new Comment(res.data[0]));
      this.newComment = new Comment();
    });
  }

  removeComment(id: number) {
    this.comments = this.comments.filter(c => c.id != id);
  }
}
