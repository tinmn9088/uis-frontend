import {
  Component,
  ErrorHandler,
  Inject,
  Injectable,
  NgZone,
  OnDestroy,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ModuleService } from './shared/services/module.service';
import { THEME_CSS_CLASS_TOKEN } from './shared/shared.module';
import { NavigationEnd, NavigationError, Router } from '@angular/router';
import { SnackbarService } from './shared/services/snackbar.service';
import { SnackbarAction } from './shared/domain/snackbar-action';

@Injectable()
export class AppErrorHandler implements ErrorHandler {
  constructor(
    private _snackbarService: SnackbarService,
    private _zone: NgZone
  ) {}

  handleError(error: Error) {
    console.error(error);
    if (error.message) {
      this._zone.run(() => {
        this._snackbarService.showError(error.message, SnackbarAction.Cross);
      });
    }
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  private _pathChangeSubscription: Subscription;
  title = 'uis-frontend';

  constructor(
    private _router: Router,
    private _moduleService: ModuleService,
    @Inject(THEME_CSS_CLASS_TOKEN) public themeClass$: BehaviorSubject<string>,
    private _snackbarService: SnackbarService,
    private _zone: NgZone
  ) {
    this._pathChangeSubscription = this._router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentPath = event.urlAfterRedirects;
        console.debug(`Current path: "${currentPath}"`);

        const moduleName = this._moduleService.getModuleNameByPath(currentPath);
        if (moduleName) {
          this.themeClass$.next(
            this._moduleService.getThemeCssClass(moduleName) || ''
          );
        }
      }
      if (event instanceof NavigationError) {
        const error = event.error;
        console.error(error);
        if (error.message) {
          this._zone.run(() => {
            this._snackbarService.showError(
              error.message,
              SnackbarAction.Cross
            );
          });
        }
      }
    });
  }

  ngOnDestroy() {
    this._pathChangeSubscription.unsubscribe();
  }
}
