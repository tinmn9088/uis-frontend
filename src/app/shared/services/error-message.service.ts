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
      ? response.error.validationMessages
        ? `${description} (${response.error.message}): ${(
            response.error.validationMessages as string[]
          ).join(', ')}`
        : `${description} (${response.error.message})`
      : response.message;
  }
}
