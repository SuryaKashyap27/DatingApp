
import { Component, inject, OnInit, signal } from '@angular/core';
import { LikesService } from '../../core/services/likes-service';
import { Member } from '../../types/member';
import { MemberCard } from '../members/member-card/member-card';
import { PaginatedResult } from '../../types/pagination';
import { Paginator } from '../../shared/paginator/paginator';

@Component({
  selector: 'app-lists',
  imports: [MemberCard,Paginator],
  templateUrl: './lists.html',
  styleUrl: './lists.css',
})
export class Lists implements OnInit {
  private likesService = inject(LikesService);

  protected members = signal<Member[]>([]);
  protected paginatedMembers = signal<PaginatedResult<Member> | null>(null);
  protected pageNumber = 1;
  protected pageSize = 5;
  protected predicate = 'liked';

  protected tabs = [
    { label: 'Liked', value: 'liked' },
    { label: 'Liked me', value: 'liked-by' },
    { label: 'Mutual', value: 'mutual' },
  ];

  ngOnInit(): void {
    this.loadLikes();
  }

  protected loadLikes() {
    this.likesService.getLikes(this.predicate,this.pageNumber,this.pageSize).subscribe({
      next: result => this.paginatedMembers.set(result),
      error: error => console.error('Failed to load likes', error)
 
    });
  }

  protected setPredicate(predicate: string) {
    if (this.predicate === predicate) return;

    this.predicate = predicate;
    this.pageNumber=1;
    this.loadLikes();
  }
  protected onPageChange(event: { pageNumber: number; pageSize: number }) {
  this.pageNumber = event.pageNumber;
  this.pageSize = event.pageSize;
  this.loadLikes();
  
}
protected get displayMessage(): string {
  const selectedTab = this.tabs.find(
    tab => tab.value === this.predicate
  );

  const totalCount = this.paginatedMembers()?.metadata.totalCount ?? 0;

  return `Selected: ${selectedTab?.label ?? 'Liked'} | ${totalCount} members`;
}
}
