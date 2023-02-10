import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../../../user/models/user.model';
import { Language } from '../../domain/language';
import { LanguageService } from '../../services/language.service';
import { ModuleName } from '../../domain/module-name';
import { ModuleService } from '../../services/module.service';
import { Tab } from '../../domain/module-tab';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit, AfterViewInit, OnDestroy {
  private _resizeObserver: ResizeObserver;
  private _pathChangeSubscription: Subscription;
  readonly languages = Language;
  tabs: Tab[] = [
    {
      title: this._moduleService.getI18N(ModuleName.Category),
      path: this._moduleService.getPath(ModuleName.Category),
    },
    {
      title: this._moduleService.getI18N(ModuleName.Discipline),
      path: this._moduleService.getPath(ModuleName.Discipline),
    },
    {
      title: this._moduleService.getI18N(ModuleName.Specialization),
      path: this._moduleService.getPath(ModuleName.Specialization),
    },
    {
      title: this._moduleService.getI18N(ModuleName.Curricula),
      path: this._moduleService.getPath(ModuleName.Curricula),
    },
  ];
  addMenuItems = [
    { text: 'toolbar.menu.add.category', path: '/' },
    { text: 'toolbar.menu.add.discipline', path: '/' },
    { text: 'toolbar.menu.add.specialization', path: '/' },
    { text: 'toolbar.menu.add.curricula', path: '/' },
  ];
  activeTab?: Tab;
  compact = false;
  user?: User;
  @Input() showTabs = true;
  @Output() menuButtonClick = new EventEmitter();
  @ViewChild(MatToolbar) matToolbar!: MatToolbar;

  constructor(
    public languageService: LanguageService,
    private _moduleService: ModuleService,
    private _router: Router
  ) {
    this._resizeObserver = new ResizeObserver(entries => {
      this.onResize(entries[0]?.contentRect.width);
    });
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

  ngAfterViewInit() {
    this._resizeObserver.observe(this.matToolbar._elementRef.nativeElement);
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

  onResize(width: number) {
    this.compact = width < 960;
  }
}
