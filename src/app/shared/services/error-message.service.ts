import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorMessageService {
  buildHttpErrorMessage(
    response: HttpErrorResponse,
    description: string
  ): string {
    return response.status < 500
      ? `${description} (${response.error.message})`
      : response.message;
  }
}
