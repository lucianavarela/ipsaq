import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Comment } from '../classes/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  table='comments';

  constructor(public sSupabase: SupabaseService) { }

  getComments() {
    return this.sSupabase.get(this.table).order('created_at', {ascending: false});
  }

  getComment(id: number) {
    return this.sSupabase.getById(id, this.table);
  }

  async createComment(comment: Comment) {
    return await this.sSupabase.add(comment, this.table);
  }

  async deleteComment(id: number) {
    return await this.sSupabase.deleteById(id, this.table);
  }
}
