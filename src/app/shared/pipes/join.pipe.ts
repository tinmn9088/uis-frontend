import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'join',
})
export class JoinPipe implements PipeTransform {
  transform(input: string[] | undefined, sep = ','): string | undefined {
    return input?.join(sep);
  }
}
