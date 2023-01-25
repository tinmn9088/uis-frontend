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
import { Language } from '../../enums/language.enum';
import { LanguageService } from '../../services/language.service';
import { ModuleName } from '../../enums/module-name.enum';
import { ModuleService } from '../../services/module.service';

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
  readonly languages = Language;
  tabs: Tab[] = [
    {
      title: this.moduleService.getI18N(ModuleName.Category),
      path: '/',
    },
    {
      title: this.moduleService.getI18N(ModuleName.Discipline),
      path: '/',
    },
    {
      title: this.moduleService.getI18N(ModuleName.Specialization),
      path: '/specializations/list',
    },
    {
      title: this.moduleService.getI18N(ModuleName.Curricula),
      path: '/',
    },
  ];
  addMenuItems = [
    { text: 'toolbar.menu.add.category', path: '/' },
    { text: 'toolbar.menu.add.discipline', path: '/' },
    { text: 'toolbar.menu.add.specialization', path: '/' },
    { text: 'toolbar.menu.add.curricula', path: '/' },
  ];
  activeTab?: Tab;
  user?: User;
  @Output() menuButtonClick = new EventEmitter();

  constructor(
    public languageService: LanguageService,
    public moduleService: ModuleService,
    private _router: Router
  ) {
    this._pathChangeSubscription = this._router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        const currentPath = event.url;
        this.activeTab =
          this.activeTab || this.tabs.find(tab => tab.path === currentPath);
      }
    });
  }

  ngOnInit() {
    this.user = {
      login: 'Пользователь1',
      roles: ['admin', 'guest'],
    };
  }

  ngOnDestroy() {
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
