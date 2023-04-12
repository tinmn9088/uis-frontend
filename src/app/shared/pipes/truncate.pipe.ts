import { Pipe, PipeTransform } from '@angular/core';

/**
 * Default length is 20.
 */
@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  transform(input: string | undefined, length = 20): string | undefined {
    if (!input) return input;
    return input.length > length ? input.slice(0, length - 3) + '...' : input;
  }
}
