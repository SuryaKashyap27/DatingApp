import { Component, inject, signal, Signal, viewChild } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
// import { Observable } from 'rxjs';
import { Member, MemberParams } from '../../../types/member';
import { AsyncPipe } from '@angular/common';
import { MemberCard } from '../member-card/member-card';
import { PaginatedResult } from '../../../types/pagination';
import { Paginator } from '../../../shared/paginator/paginator';
import { FilterModal } from '../filter-modal/filter-modal';

@Component({
  imports: [MemberCard, Paginator,FilterModal],
  selector: 'app-member-list',
  styleUrl: './member-list.css',
  templateUrl: './member-list.html',
})
export class MemberList {
  protected modal = viewChild.required<FilterModal>('filterModal');
  private memberService = inject(MemberService);
  private updatedParams = new MemberParams();
  protected paginatedMembers = signal<PaginatedResult<Member> | null>(null);
  protected memberParams = new MemberParams();
  constructor() {
    const filters = localStorage.getItem('filters');

  if (filters) {
    this.memberParams = {
      ...new MemberParams(),
      ...JSON.parse(filters)
    };

    this.updatedParams = { ...this.memberParams };
  }

    this.loadMembers();
  }
  protected loadMembers() {

    this.memberService.getMembers(this.memberParams ).subscribe({next: result => {this.paginatedMembers.set(result);      }
    });
  }

  protected onPageChange(event: {
    pageNumber: number;
    pageSize: number;
  }) {


    this.memberParams.pageNumber=event.pageNumber;
    this.memberParams.pageSize=event.pageSize;

    this.loadMembers();
  }
  protected openModal() {
  this.modal().open();
}

protected onClose() {
  console.log('Modal closed');
}

protected onFilterChange(data: MemberParams) {
  this.memberParams = { ...data };
  this.updatedParams = { ...data };
  this.loadMembers();
}

protected resetFilters() {
  this.memberParams = new MemberParams();
  this.updatedParams = { ...this.memberParams };
  this.loadMembers();
}

get displayMessage(): string {
  const defaultParams = new MemberParams();
  const filters: string[] = [];

  if (this.updatedParams.gender) {
    filters.push(this.updatedParams.gender + 's');
  } else {
    filters.push('males and females');
  }

  if (
    this.updatedParams.minAge !== defaultParams.minAge ||
    this.updatedParams.maxAge !== defaultParams.maxAge
  ) {
    filters.push(
      `ages ${this.updatedParams.minAge}-${this.updatedParams.maxAge}`
    );
  }

  filters.push(
    this.updatedParams.orderBy === 'lastActive'
      ? 'recently active'
      : 'newest members'
  );

  return filters.length > 0
    ? `Selected: ${filters.join(' | ')}`
    : 'All members';
}

}