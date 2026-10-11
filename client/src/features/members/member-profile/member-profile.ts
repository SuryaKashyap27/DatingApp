
import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../../../types/member';
import { DatePipe } from '@angular/common';
import { MemberService } from '../../../core/services/member-service';

import { ViewChild, OnDestroy } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { EditableMember } from '../../../types/member';
import { ToastService } from '../../../core/services/toast';
import { AccountService } from '../../../core/services/account-service';


@Component({
  selector: 'app-member-profile',
  standalone: true,
  imports: [DatePipe, FormsModule],
  templateUrl: './member-profile.html',
  styleUrl: './member-profile.css'
})
export class MemberProfile implements OnInit, OnDestroy {

  private accountService = inject(AccountService);
  protected memberService = inject(MemberService);

  protected editableMember: EditableMember = {
    displayName: '',
    description: '',
    city: '',
    country: ''
  };

  @ViewChild('editForm') editForm?: NgForm;


  private toast = inject(ToastService);



  ngOnInit(): void {
    // this.route.parent?.data.subscribe({
    //   next: data => {
    //     this.member.set(data['member'] as Member);


    //   }
    // })
    this.editableMember = {
      displayName: this.memberService.member()?.displayName ?? '',
      description: this.memberService.member()?.description ?? '',
      city: this.memberService.member()?.city ?? '',
      country: this.memberService.member()?.country ?? '',
    }
  }

  updateProfile() {
    if (!this.memberService.member()) return;

    const updatedMember = {
      ...this.memberService.member(),
      ...this.editableMember
    };

    this.memberService.updateMember(this.editableMember)
      .subscribe({
        next: () => {
          this.toast.success('Profile updated successfully');

          this.memberService.editMode.set(false);
          this.memberService.member.set(updatedMember as Member);

          const currentUser = this.accountService.currentUser();

          if (
            currentUser &&
            updatedMember.displayName !== currentUser.displayName
          ) {
            currentUser.displayName = updatedMember.displayName;
            this.accountService.setCurrentUser(currentUser);
          }

          this.editForm?.reset(updatedMember);
        }
      });
  }

  ngOnDestroy(): void {
    if (this.memberService.editMode()) {
      this.memberService.editMode.set(false);
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  notify($event: BeforeUnloadEvent) {
    if (this.editForm?.dirty) {
      $event.preventDefault();
      $event.returnValue = true;
    }
  }
}
