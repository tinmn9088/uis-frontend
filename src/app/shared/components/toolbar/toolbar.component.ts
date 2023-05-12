import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Language } from '../../domain/language';
import { LanguageService } from '../../services/language.service';
import { ToolbarTab } from '../../domain/toolbar-tab';
import { MatToolbar } from '@angular/material/toolbar';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from 'src/app/user/domain/user';
import { ModuleService } from '../../services/module.service';
import { MatDialog } from '@angular/material/dialog';
import { LogoutDialogComponent } from 'src/app/auth/components/logout-dialog/logout-dialog.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit, AfterViewInit {
  private _resizeObserver: ResizeObserver;
  readonly languages = Language;
  addMenuItems: { text: string; path: string }[];
  compact = false;

  /**
   * Is passed through TranslateService pipeline.
   */
  @Input() tabs: ToolbarTab[] = [];

  @Input() activeTab?: ToolbarTab;

  /**
   * `false` by default.
   */
  @Input() showTabs = false;
  @Input() showBurger = false;
  @Input() showMainPageButton = false;

  /**
   * `ModuleService.getMainPagePath()` value by default.
   */
  @Input() mainPagePath!: string;

  @Input() showAddMenu = false;
  @Output() menuButtonClick = new EventEmitter();
  @Output() mainPageButtonClick = new EventEmitter();
  @ViewChild(MatToolbar) matToolbar!: MatToolbar;

  constructor(
    public languageService: LanguageService,
    public authService: AuthService,
    private _moduleService: ModuleService,
    private _router: Router,
    private _matDialog: MatDialog
  ) {
    this._resizeObserver = new ResizeObserver(entries => {
      this.onResize(entries[0]?.contentRect.width);
    });
    this.addMenuItems = this._moduleService
      .getCreateOptions()
      .filter(option =>
        this.authService.hasUserPermissions(option.requiredPermissions)
      )
      .map(option => {
        return { text: option.title, path: option.path };
      });
  }

  get user(): User | undefined {
    return this.authService.user;
  }

  ngOnInit() {
    if (!this.mainPagePath) {
      this.mainPagePath = this._moduleService.getMainPagePath();
    }
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

  onMainPageClick() {
    this.mainPageButtonClick.emit();
  }

  onResize(width: number) {
    this.compact = width < 960;
  }

  onShowProfile() {
    this._router.navigateByUrl(this.mainPagePath);
  }

  onLogout() {
    const dialogRef = this._matDialog.open(LogoutDialogComponent);
    dialogRef.afterClosed().subscribe(isLogoutConfirmed => {
      if (isLogoutConfirmed) {
        this.authService.logout();
        this._router.navigateByUrl('/');
      }
    });
  }

  getUserRolesNames(): string[] | undefined {
    return this.user?.roles.map(role => role.name);
  }
}
