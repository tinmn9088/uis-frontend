import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  private _config: any;

  constructor(private _injector: Injector) { }

  load(): Observable<void> {
    let http = this._injector.get(HttpClient);
    return new Observable((subscriber) => {
      http.get('assets/app-config.json')
      .subscribe((data) => {
        this._config = data;
        subscriber.complete();
      });
    });
  }

  get config() {
    return this._config;
  }
}
