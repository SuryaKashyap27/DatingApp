import { Component,inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegisterCreds, User } from '../../../types/types';
import { AccountService } from '../../../core/services/account-service';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  private accountService = inject(AccountService);
//  membersFromHome=input.required<User []>();
  protected creds = {} as RegisterCreds;
  cancleRegister=output<boolean>();

register() {

    this.accountService.register(this.creds).subscribe({
        next: response => {
            console.log(response);
            this.cancel();
        },
        error: error => {
            console.log(error);
        }
    });

}

  cancel() {
    // console.log('Cancelled!');
    this.cancleRegister.emit(false); 
  }

}