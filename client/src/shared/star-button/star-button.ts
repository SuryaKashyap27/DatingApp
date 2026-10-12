
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-star-button',
  standalone: true,
  imports: [],
  templateUrl: './star-button.html',
  styleUrl: './star-button.css'
})
export class StarButton {
  disabled = input(false);
  selected = input(false);

  clickEvent = output<Event>();

  onClick(event: Event) {
    this.clickEvent.emit(event);
  }
}
