import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private _snackBar: MatSnackBar) {}

  showSuccess(
    message: string,
    action?: string
  ): MatSnackBarRef<TextOnlySnackBar> {
    return this.showMessageAndAction(`✅ ${message}`, action);
  }

  showError(
    message: string,
    action?: string
  ): MatSnackBarRef<TextOnlySnackBar> {
    return this.showMessageAndAction(`❌ ${message}`, action);
  }

  showInfo(message: string, action?: string): MatSnackBarRef<TextOnlySnackBar> {
    return this.showMessageAndAction(`❕ ${message}`, action);
  }

  private showMessageAndAction(message: string, action?: string) {
    return this._snackBar.open(message, action, {
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      duration: 2000,
    });
  }
}
