import { AbstractControl } from '@angular/forms';

export function AgeValidator(control: AbstractControl): { [key: string]: boolean } | null {

  // var dateParts = control.value.split("/");
  // var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
  // var timeDiff = Math.abs(Date.now() - new Date(dateObject).getTime());
  // var age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
  var age=3;

  if (age < 4) {
    return { 'age': true };
  }
  return null;
}
