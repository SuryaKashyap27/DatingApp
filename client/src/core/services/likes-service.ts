
import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { Member } from '../../types/member';
import { environment } from '../../environments/environment';
import { PaginatedResult } from '../../types/pagination';

@Service()
export class LikesService {
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  likeIds = signal<string[]>([]);

  toggleLike(targetMemberId: string) {
    return this.http.post(
      `${this.baseUrl}likes/${targetMemberId}`,
      {}
    );
  }

  getLikes(predicate: string,pageNumber : number,pageSize : number) {
    return this.http.get<PaginatedResult<Member>>(
      `${this.baseUrl}likes?predicate=${predicate}&pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }

  getLikeIds() {
    this.http.get<string[]>(`${this.baseUrl}likes/list`).subscribe({
      next: ids => this.likeIds.set(ids),
      error: error => console.error('Failed to load like IDs', error)
    });
  }

  clearLikeIds() {
    this.likeIds.set([]);
  }
}
