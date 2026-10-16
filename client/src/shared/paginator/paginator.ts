import { Component, computed, input, model, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-paginator',
  styleUrl: './paginator.css',
  templateUrl: './paginator.html',
})
export class Paginator
 {
  pageNumber = model(1);
  pageSizeOptions = input([5, 10, 20, 50]);
  pageSize   = model(10);
  totalCount = input(0);
  totalPages=input(0);
  pageChange = output<{
  pageNumber: number;
  pageSize: number;
}>();


  onPageChange( newPageNumber?: number,  newPageSize?: number)
  {
    if(newPageNumber)
    {
      this.pageNumber.set(newPageNumber);
    }
    if(newPageSize)
    {
      this.pageSize.set(newPageSize);
    }
    this.pageChange.emit({
      pageNumber: this.pageNumber(),
      pageSize: this.pageSize()
    });

   
  }

  lastItemIndex = computed(() =>  Math.min( this.pageNumber() * this.pageSize(),  this.totalCount() )
);
onPageSizeChange(event: Event) {
  const select = event.target as HTMLSelectElement;
  const size = Number(select.value);

  this.onPageChange(undefined, size);
}
 }

