
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { Member } from '../../../types/member';
import { AgePipe } from '../../../app/age-pipe';
import { AccountService } from '../../../core/services/account-service';
import { MemberService } from '../../../core/services/member-service';
@Component({
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet,AgePipe],
  selector: 'app-member-detailed',
  styleUrl: './member-detailed.css',
  templateUrl: './member-detailed.html',
})
export class MemberDetailed implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private accountService = inject(AccountService);
  // protected member = signal<Member | undefined>(undefined);
  protected title = signal<string | undefined>('Profile');
  protected memberService = inject(MemberService);
  protected isCurrentUser = computed(() => {  return this.accountService.currentUser()?.id ===  this.route.snapshot.paramMap.get('id');});
  ngOnInit(): void {
   this.route.data.subscribe({
  next: data => {
    const member = data['member'] as Member;

    // this.member.set(member);
    this.memberService.member.set(member);
  }
});
  

    this.title.set(this.route.firstChild?.snapshot.title);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.title.set(this.route.firstChild?.snapshot.title);
      });
  }

  
}
