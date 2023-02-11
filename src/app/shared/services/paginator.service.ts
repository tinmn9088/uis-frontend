import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaginatorService {
  generatePageIndexes(
    pageIndex = 0,
    numberOfPages: number,
    indexButtonsDisplayed: number
  ) {
    const length = Math.min(indexButtonsDisplayed, numberOfPages);
    let firstNumber = Math.min(
      Math.max(0, pageIndex - indexButtonsDisplayed / 2),
      numberOfPages - indexButtonsDisplayed
    );
    if (firstNumber < 0) firstNumber = 0;
    return Array.from({ length }, (_, i) => firstNumber + i);
  }
}
