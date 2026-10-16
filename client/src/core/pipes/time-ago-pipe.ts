
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    const now = new Date().getTime();
    const past = new Date(value).getTime();

    const delta = Math.floor((now - past) / 1000);

    if (delta < 29) return 'just now';

    const intervals: { [key: string]: number } = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1,
    };

    for (const interval in intervals) {
      const counter = Math.floor(delta / intervals[interval]);

      if (counter >= 1) {
        return counter === 1
          ? `1 ${interval} ago`
          : `${counter} ${interval}s ago`;
      }
    }

    return 'just now';
  }
}
