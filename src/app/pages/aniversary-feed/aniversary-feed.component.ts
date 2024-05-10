import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Comment } from 'src/app/classes/comment';
import { CommentsService } from 'src/app/services/comments.service';

@Component({
  selector: 'app-aniversary-feed',
  templateUrl: './aniversary-feed.component.html',
  styleUrl: './aniversary-feed.component.scss'
})
export class AniversaryFeedComponent implements OnInit {
  comments: Comment[] = [];
  commentDisplayed!: Comment;
  index: number = 0;
  timeoutID!: any;

  constructor(private sTitle: Title, private sComments: CommentsService) { }

  ngOnInit(): void {
    this.sTitle.setTitle(`100 Aniversario Feed`);
    this.fetchComments();
  }

  fetchComments() {
    this.sComments.getComments().then(res => {
      this.index = 0;
      if (res.data) {
        const comments = res.data.map((c: any) => new Comment(c));
        this.comments = comments;
      }
      if (this.comments && this.comments.length) this.triggerCarousel();
    });
  }

  triggerCarousel() {
    this.commentDisplayed = this.comments[this.index];
    this.timeoutID = setTimeout(() => {
      this.index += 1;
      if (this.comments && this.index == this.comments.length) {
        clearTimeout(this.timeoutID);
        this.fetchComments();
      } else {
        this.triggerCarousel();
      }
    }, 5000);
  }
}
