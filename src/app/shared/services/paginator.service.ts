import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaginatorService {
  generatePageIndexes(
    pageIndex: number,
    numberOfPages: number,
    indexButtonsDisplayed: number
  ) {
    const length = Math.min(indexButtonsDisplayed, numberOfPages);
    const firstNumber = Math.min(
      Math.max(0, pageIndex - indexButtonsDisplayed / 2),
      numberOfPages - indexButtonsDisplayed
    );
    return Array.from({ length }, (_, i) => firstNumber + i);
  }
}
