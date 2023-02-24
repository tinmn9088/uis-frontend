import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  templateUrl: './app-routing-redirect.component.html',
})
export class AppRoutingRedirectComponent implements OnInit {
  public redirectTo: string;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) {
    const absolutePath =
      this._activatedRoute.snapshot.data['redirectTo'].startsWith('/');
    this.redirectTo = absolutePath
      ? this._activatedRoute.snapshot.data['redirectTo']
      : `${this._router.url}/${this._activatedRoute.snapshot.data['redirectTo']}`;
  }

  ngOnInit(): void {
    console.warn(`Redirect to "${this.redirectTo}"`);
    setTimeout(() => this._router.navigateByUrl(this.redirectTo), 0);
  }
}
