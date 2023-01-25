import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../../../user/models/user.model';

declare type Tab = {
  title: string;
  path: string;
};

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit, OnDestroy {
  private _pathChangeSubscription: Subscription;
  tabs: Tab[] = [
    { title: 'toolbar.tabs.categories', path: '/' },
    { title: 'toolbar.tabs.disciplines', path: '/' },
    { title: 'toolbar.tabs.specializations', path: '/specializations/list' },
    { title: 'toolbar.tabs.curricula', path: '/' },
  ];
  addMenuItems = [
    { text: 'toolbar.menu.add.category', path: '/' },
    { text: 'toolbar.menu.add.discipline', path: '/' },
    { text: 'toolbar.menu.add.specialization', path: '/' },
    { text: 'toolbar.menu.add.curricula', path: '/' },
  ];
  loginMenuItems = [
    {
      text: 'toolbar.menu.login.show_profile',
      path: '/',
      icon: 'account_circle',
    },
    {
      text: 'toolbar.menu.login.change_language',
      path: '/',
      icon: 'language',
    },
    {
      text: 'toolbar.menu.login.settings',
      path: '/',
      icon: 'settings',
    },
    {
      text: 'toolbar.menu.login.logout',
      path: '/',
      icon: 'exit_to_app',
      color: 'red',
    },
  ];
  activeTab?: Tab;
  user?: User;
  @Output() menuButtonClick = new EventEmitter();

  constructor(private _router: Router) {
    this._pathChangeSubscription = this._router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        const currentPath = event.url;
        console.debug(`Current path: "${currentPath}"`);
        this.activeTab =
          this.activeTab || this.tabs.find(tab => tab.path === currentPath);
      }
    });
  }

  ngOnInit(): void {
    this.user = {
      login: 'Пользователь1',
      roles: ['admin', 'guest'],
    };
  }

  ngOnDestroy(): void {
    this._pathChangeSubscription.unsubscribe();
  }

  onTabClick(tab: Tab) {
    this.activeTab = tab;
    this._router.navigateByUrl(tab.path);
  }

  onMenuClick() {
    this.menuButtonClick.emit();
  }
}
