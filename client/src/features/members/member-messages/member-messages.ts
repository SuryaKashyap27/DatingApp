// import { Component, inject, OnInit, signal } from '@angular/core';
// import { MessageService } from '../../../core/services/features/messages/message-service';
// import { MemberService } from '../../../core/services/member-service';
// import { Message } from '../../../types/message';
// import { AccountService } from '../../../core/services/account-service';
// import { TimeAgoPipe } from '../../../core/pipes/time-ago-pipe';
// import { DatePipe } from '@angular/common';

// @Component({
//   imports: [DatePipe, TimeAgoPipe],
//   selector: 'app-member-messages',
//   styleUrl: './member-messages.css',
//   templateUrl: './member-messages.html',
// })
// export class MemberMessages implements OnInit{

//    private messageService = inject(MessageService);
//   private memberService = inject(MemberService);
//   private accountService = inject(AccountService);

//   protected messages = signal<Message[]>([]);

//   ngOnInit(): void {
//     this.loadMessages();
//   }

//   // loadMessages() {
//   //   const memberId = this.memberService.member()?.id;

//   //   if (memberId) {
//   //     this.messageService.getMessageThread(memberId).subscribe({
//   //       next: messages => this.messages.set(messages),
//   //       error: error => console.error('Failed to load message thread', error)
//   //     });
//   //   }
//   // }
//   loadMessages() {
//   const memberId = this.memberService.member()?.id;
//   const currentUserId = this.accountService.currentUser()?.id;

//   if (memberId) {
//     this.messageService.getMessageThread(memberId).subscribe({
//       next: messages => {
//         this.messages.set(
//           messages.map(message => ({
//             ...message,
//             currentUserSender: message.senderId === currentUserId
//           }))
//         );
//       },
//       error: error => console.error('Failed to load message thread', error)
//     });
//   }
// }


// }




import { Component, effect, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MessageService } from '../../../core/services/features/messages/message-service';
import { MemberService } from '../../../core/services/member-service';
import { AccountService } from '../../../core/services/account-service';
import { TimeAgoPipe } from '../../../core/pipes/time-ago-pipe';
import { Message } from '../../../types/message';

@Component({
  selector: 'app-member-messages',
  imports: [DatePipe, TimeAgoPipe, FormsModule],
  styleUrl: './member-messages.css',
  templateUrl: './member-messages.html',
})
export class MemberMessages implements OnInit {
  private messageService = inject(MessageService);
  private memberService = inject(MemberService);
  private accountService = inject(AccountService);
  @ViewChild('messageEndRef')
  messageEndRef!: ElementRef;


  protected messages = signal<Message[]>([]);
  protected messageContent = '';

  constructor() {
    effect(() => {
      const currentMessages = this.messages();

      if (currentMessages.length > 0) {
        setTimeout(() => this.scrollToBottom());
      }
    });
  }

  scrollToBottom() {
    this.messageEndRef?.nativeElement.scrollIntoView({
      behavior: 'smooth'
    });
  }



  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    const memberId = this.memberService.member()?.id;
    const currentUserId = this.accountService.currentUser()?.id;

    if (!memberId) return;

    this.messageService.getMessageThread(memberId).subscribe({
      next: messages => {
        this.messages.set(
          messages.map(message => ({
            ...message,
            currentUserSender: message.senderId === currentUserId
          }))
        );
      },
      error: error => console.error('Failed to load message thread', error)
    });
  }

  sendMessage() {
    const recipientId = this.memberService.member()?.id;
    const content = this.messageContent.trim();

    if (!recipientId || !content) return;

    this.messageService.sendMessage(recipientId, content).subscribe({
      next: message => {
        this.messages.update(messages => [
          ...messages,
          { ...message, currentUserSender: true }
        ]);

        this.messageContent = '';
      },
      error: error => console.error('Failed to send message', error)
    });
  }
}

