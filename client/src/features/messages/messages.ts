
import { Component, OnInit, inject, signal } from '@angular/core';
import { MessageService } from '../../core/services/features/messages/message-service';
import { Message } from '../../types/message';
import { PaginatedResult } from '../../types/pagination';
import { DatePipe } from '@angular/common';
import { Paginator } from '../../shared/paginator/paginator';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [DatePipe, Paginator, RouterLink],
  templateUrl: './messages.html',
  styleUrl: './messages.css'
})
export class Messages implements OnInit {
  private messageService = inject(MessageService);

  protected container = 'inbox';
  protected pageNumber = 1;
  protected pageSize = 10;
  protected fetchedContainer = 'inbox';
  protected paginatedMessages =
    signal<PaginatedResult<Message> | null>(null);

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    this.messageService
      .getMessages(this.container, this.pageNumber, this.pageSize)
      .subscribe({
        next: response => {
          this.paginatedMessages.set(response);
          this.fetchedContainer = this.container;
        },
        error: error => console.error('Failed to load messages', error)
      });
  }

  protected tabs = [
    { label: 'Inbox', value: 'inbox' },
    { label: 'Outbox', value: 'outbox' }
  ];

  protected get isInbox() {
    // return this.container === 'inbox';
    return this.fetchedContainer === 'inbox';
  }

  protected setContainer(container: string) {
    this.container = container;
    this.pageNumber = 1;
    this.loadMessages();
  }

  protected onPageChange(event: { pageNumber: number; pageSize: number }) {
    this.pageNumber = event.pageNumber;
    this.pageSize = event.pageSize;
    this.loadMessages();
  }

  deleteMessage(event: Event, id: string) {
  event.stopPropagation();

  this.messageService.deleteMessage(id).subscribe({
    next: () => {
      const current = this.paginatedMessages();

      this.paginatedMessages.update(prev => {
        if (!prev) return null;

        const newItems = prev.items.filter(x => x.id !== id);

        return {
          items: newItems,
          metadata: prev.metadata
        };
      });
    },
    error: error => console.error('Failed to delete message', error)
  });
}

}
