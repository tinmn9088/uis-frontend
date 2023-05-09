import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorMessageService {
  buildHttpErrorMessage(response: HttpErrorResponse, message?: string): string {
    return message
      ? `${message} (${response.error.message})`
      : response.message;
  }
}
