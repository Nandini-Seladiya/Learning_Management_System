import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'showSeconds'
})
export class ShowSecondsPipe implements PipeTransform {

  transform(seconds: number): string {
    return `${seconds} second${(seconds > 1)? 's': ''}`
  }

}
