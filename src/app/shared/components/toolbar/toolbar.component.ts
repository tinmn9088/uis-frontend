import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription, distinctUntilChanged, tap } from 'rxjs';
import { User } from '../../../user/models/user.model';
import { Language } from '../../enums/language.enum';
import { LanguageService } from '../../services/language.service';
import { ModuleName } from '../../enums/module-name.enum';
import { ModuleService } from '../../services/module.service';
import { BreakpointObserver } from '@angular/cdk/layout';

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
  private readonly BREAKPOINT = '(min-width: 960px)';
  private _pathChangeSubscription: Subscription;
  private readonly _breakpoint$ = this._breakpointObserver
    .observe([this.BREAKPOINT])
    .pipe(
      tap(value => console.log(value)),
      distinctUntilChanged()
    );
  readonly languages = Language;
  tabs: Tab[] = [
    {
      title: this._moduleService.getI18N(ModuleName.Category),
      path: '/',
    },
    {
      title: this._moduleService.getI18N(ModuleName.Discipline),
      path: '/',
    },
    {
      title: this._moduleService.getI18N(ModuleName.Specialization),
      path: '/specializations/list',
    },
    {
      title: this._moduleService.getI18N(ModuleName.Curricula),
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
  compact = true;
  user?: User;
  @Output() menuButtonClick = new EventEmitter();

  constructor(
    public languageService: LanguageService,
    private _moduleService: ModuleService,
    private _breakpointObserver: BreakpointObserver,
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
    this._breakpoint$.subscribe(() => this.breakpointChanged());
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

  private breakpointChanged() {
    this.compact = !this._breakpointObserver.isMatched(this.BREAKPOINT);
  }
}
