import { Component, inject } from '@angular/core';
import { MemberService } from '../../../core/services/member';
import { Observable } from 'rxjs';
import { Member } from '../../../types/member';
import { AsyncPipe } from '@angular/common';
import { MemberCard } from '../member-card/member-card';

@Component({
  imports: [AsyncPipe, MemberCard],
  selector: 'app-member-list',
  styleUrl: './member-list.css',
  templateUrl: './member-list.html',
})
export class MemberList {
  private memberService = inject(MemberService);

  protected members$: Observable<Member[]>;

  constructor() {
    this.members$ = this.memberService.getMembers();
  }
}