
import { Component, input, Self } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NgControl,
  ReactiveFormsModule
} from '@angular/forms';

@Component({
  selector: 'app-text-inputs',
  imports: [ReactiveFormsModule],
  templateUrl: './text-inputs.html',
  styleUrl: './text-inputs.css'
})
export class TextInputs implements ControlValueAccessor {

  label = input<string>('');
  type = input<string>('text');
  maxDate= input <string>('');

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }

  writeValue(obj: any): void {
  }

  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }

  get control(): FormControl {
    return this.ngControl.control as FormControl;
  }
}
