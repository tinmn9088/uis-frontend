import { Component, OnDestroy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ModuleService } from './shared/services/module.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  private _pathChangeSubscription: Subscription;
  title = 'uis-frontend';
  themeClass?: string;

  constructor(private _router: Router, private _moduleService: ModuleService) {
    this._pathChangeSubscription = this._router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        const currentPath = event.url;
        console.debug(`Current path: "${currentPath}"`);
        this.themeClass = _moduleService.getThemeCssClassByUrl(currentPath);
      }
    });
  }

  ngOnDestroy() {
    this._pathChangeSubscription.unsubscribe();
  }
}
