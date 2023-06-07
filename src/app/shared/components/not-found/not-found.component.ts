import { Component } from '@angular/core';
import { ModuleService } from '../../services/module.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent {
  resourceName?: string;

  constructor(
    private _moduleService: ModuleService,
    private _route: ActivatedRoute
  ) {
    this._route.data.subscribe(({ resourceName }) => {
      this.resourceName = resourceName;
    });
  }

  getLinkToMainPage() {
    return this._moduleService.getMainPagePath();
  }
}
