import { Component, ElementRef, model, output, viewChild } from '@angular/core';
import { MemberParams } from '../../../types/member';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-modal',
  imports: [FormsModule],
  templateUrl: './filter-modal.html',
  styleUrl: './filter-modal.css',
})
export class FilterModal {
  modalRef = viewChild.required<ElementRef<HTMLDialogElement>>('filterModal');
  // protected memberParams = new MemberParams();
  memberParams = model(new MemberParams());
  closeModal = output<void>();
  submitData = output<MemberParams>();

  open() {
    this.modalRef().nativeElement.showModal();
  }

  close() {
    this.modalRef().nativeElement.close();
    this.closeModal.emit();
  }

  submit() {
    this.submitData.emit(this.memberParams());
    this.close();
  }


  // onMinAgeChange() {
  //   if (this.memberParams.minAge < 18) {
  //     this.memberParams.minAge = 18;
  //   }

  //   if (this.memberParams.maxAge < this.memberParams.minAge) {
  //     this.memberParams.maxAge = this.memberParams.minAge;
  //   }
  // }

  // onMaxAgeChange() {
  //   if (this.memberParams.maxAge < this.memberParams.minAge) {
  //     this.memberParams.maxAge = this.memberParams.minAge;
  //   }
  // }


  
onMinAgeChange() {
  const params = this.memberParams();

  if (params.minAge < 18) {
    this.memberParams.update(p => ({ ...p, minAge: 18 }));
  }

  if (this.memberParams().maxAge < this.memberParams().minAge) {
    this.memberParams.update(p => ({ ...p, maxAge: p.minAge }));
  }
}



onMaxAgeChange() {
  if (this.memberParams().maxAge < this.memberParams().minAge) {
    this.memberParams.update(p => ({ ...p, maxAge: p.minAge }));
  }
}

}

