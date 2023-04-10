import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Language } from '../../domain/language';
import { LanguageService } from '../../services/language.service';
import { ToolbarTab } from '../../domain/toolbar-tab';
import { MatToolbar } from '@angular/material/toolbar';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from 'src/app/user/domain/user';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements AfterViewInit {
  private _resizeObserver: ResizeObserver;
  readonly languages = Language;
  addMenuItems = [
    { text: 'toolbar.menu.add.category', path: '/category/add' },
    { text: 'toolbar.menu.add.discipline', path: '/discipline/add' },
    { text: 'toolbar.menu.add.specialization', path: '/specialization/add' },
    { text: 'toolbar.menu.add.curricula', path: '/curriculum/add' },
  ];
  compact = false;
  @Input() user?: User;

  /**
   * Is passed through TranslateService pipeline.
   */
  @Input() tabs: ToolbarTab[] = [];

  @Input() activeTab?: ToolbarTab;
  @Input() showTabs = false;
  @Input() showBurger = false;
  @Input() showAddMenu = false;
  @Output() menuButtonClick = new EventEmitter();
  @ViewChild(MatToolbar) matToolbar!: MatToolbar;

  constructor(
    public languageService: LanguageService,
    private _authService: AuthService,
    private _router: Router
  ) {
    this._resizeObserver = new ResizeObserver(entries => {
      this.onResize(entries[0]?.contentRect.width);
    });
  }

  ngAfterViewInit() {
    this._resizeObserver.observe(this.matToolbar._elementRef.nativeElement);
  }

  onTabClick(tab: ToolbarTab) {
    this._router
      .navigateByUrl(tab.path)
      .catch(() => this._router.navigateByUrl('/'));
  }

  onMenuClick() {
    this.menuButtonClick.emit();
  }

  onResize(width: number) {
    this.compact = width < 960;
  }

  onShowProfile() {
    this._router.navigateByUrl('/user/main');
  }

  onLogout() {
    this._authService.logout();
    this._router.navigateByUrl('/');
  }

  getUserRolesNames(): string[] | undefined {
    return this.user?.roles.map(role => role.name);
  }
}
