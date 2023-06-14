import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  MatDrawer,
  MatDrawerContainer,
  MatDrawerContent,
} from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BehaviorSubject, Subscription, distinctUntilChanged } from 'rxjs';
import { ModuleOption } from '../../domain/module-option';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { ModuleService } from '../../services/module.service';
import { ModuleName } from '../../domain/module-name';
import { THEME_CSS_CLASS_TOKEN } from '../../shared.module';
import { ToolbarTab } from '../../domain/toolbar-tab';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-module-layout',
  templateUrl: './module-layout.component.html',
  styleUrls: ['./module-layout.component.scss'],
})
export class ModuleLayoutComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly BREAKPOINT = '(min-width: 768px)';
  private readonly _breakpoint$ = this._breakpointObserver
    .observe([this.BREAKPOINT])
    .pipe(distinctUntilChanged());
  private _pathChangeSubscription: Subscription;
  private _resizeObserver: ResizeObserver;
  private _previousUrl?: string;
  contentHeightPixels?: number;
  sidenavFullsize = true;
  showToolbarTabs = true;
  isContentHidden = true;
  sidenavOptions!: ModuleOption[];
  activeOption?: ModuleOption;
  toolbarTabs!: ToolbarTab[];
  activeTab?: ToolbarTab;
  createPath?: string;
  showCreateButton = false;
  @ViewChild(MatDrawerContainer) drawerContainer!: MatDrawerContainer;
  @ViewChild(MatDrawerContent) drawerContent!: MatDrawerContent;
  @ViewChild(MatDrawer) drawer!: MatDrawer;

  constructor(
    private _breakpointObserver: BreakpointObserver,
    private _router: Router,
    private _moduleService: ModuleService,
    private _authService: AuthService,
    @Inject(THEME_CSS_CLASS_TOKEN) public themeClass$: BehaviorSubject<string>
  ) {
    this._resizeObserver = new ResizeObserver(entries => {
      this.contentHeightPixels = entries[0]?.contentRect.height;
    });
    this.toolbarTabs = [
      {
        title: this._moduleService.getI18N(ModuleName.Category) || '',
        path: this._moduleService.getPath(ModuleName.Category) || '',
        requiredPermissions: this._moduleService.getRequiredPermissions(
          ModuleName.Category
        ),
      },
      {
        title: this._moduleService.getI18N(ModuleName.Discipline) || '',
        path: this._moduleService.getPath(ModuleName.Discipline) || '',
        requiredPermissions: this._moduleService.getRequiredPermissions(
          ModuleName.Discipline
        ),
      },
      {
        title: this._moduleService.getI18N(ModuleName.Specialization) || '',
        path: this._moduleService.getPath(ModuleName.Specialization) || '',
        requiredPermissions: this._moduleService.getRequiredPermissions(
          ModuleName.Specialization
        ),
      },
      {
        title: this._moduleService.getI18N(ModuleName.Curriculum) || '',
        path: this._moduleService.getPath(ModuleName.Curriculum) || '',
        requiredPermissions: this._moduleService.getRequiredPermissions(
          ModuleName.Curriculum
        ),
      },
    ];
    this._pathChangeSubscription = this._router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        const currentUrl = event.url.split('?')[0];
        if (currentUrl !== this._previousUrl) {
          this._previousUrl = currentUrl;
          this.isContentHidden = true;
        }
      }
      if (event instanceof NavigationEnd) {
        const currentPath = event.urlAfterRedirects;

        const moduleName = this._moduleService.getModuleNameByPath(currentPath);
        if (!moduleName) {
          return;
        }
        this.sidenavOptions = this._moduleService.getOptions(moduleName) || [];
        this.activeOption = this.sidenavOptions.find(option =>
          this.isActiveOption(currentPath, option)
        );
        this.activeTab = this.toolbarTabs.find(tab =>
          currentPath.startsWith(tab.path)
        );
        const createOption = this._moduleService.getCreateOption(moduleName);
        this.createPath = createOption?.path;
        this.showCreateButton =
          !!this.createPath &&
          !!createOption &&
          this._authService.hasUserPermissions(
            createOption.requiredPermissions
          );

        setTimeout(() => {
          this.isContentHidden = false;
        }, 200);
      }
    });
    this._previousUrl = this._router.url.split('?')[0];
  }

  ngOnInit() {
    this._breakpoint$.subscribe(() => this.onBreakpointChange());
  }

  ngAfterViewInit() {
    setTimeout(() => this.onBreakpointChange(), 0);
    this._resizeObserver.observe(
      (this.drawerContainer as any)._element.nativeElement
    );
  }

  ngOnDestroy() {
    this._pathChangeSubscription.unsubscribe();
  }

  onDrawerOpenedStart() {
    const compact = !this._breakpointObserver.isMatched(this.BREAKPOINT);
    if (compact) {
      this.showToolbarTabs = false;
    }
  }

  onDrawerClosedStart() {
    const compact = !this._breakpointObserver.isMatched(this.BREAKPOINT);
    if (compact) {
      this.showToolbarTabs = true;
    }
  }

  isSidenavOptionHidden(option: ModuleOption): boolean {
    // always show active
    if (option === this.activeOption) return false;

    // hide if required permissions are not present
    if (!this._authService.hasUserPermissions(option.requiredPermissions)) {
      return true;
    }

    // get all options with the same group id,
    // show only the first option from the group or the active one
    const group = this.sidenavOptions.filter(
      other => other.groupId === option.groupId
    );
    if (group.find(optionFromGroup => optionFromGroup === this.activeOption)) {
      return true;
    }
    return option !== group[0];
  }

  private isActiveOption(currentPath: string, option: ModuleOption) {
    let active = currentPath.startsWith(option.path);
    if (option.pathRegex) {
      active = active || currentPath.match(option.pathRegex) !== null;
    }
    return active;
  }

  private onBreakpointChange() {
    const compact = !this._breakpointObserver.isMatched(this.BREAKPOINT);
    if (compact) {
      if (this.drawer) {
        this.drawer.mode = 'over';
        this.drawer.opened = false;
        this.sidenavFullsize = true;
      }
    } else {
      if (this.drawer) {
        this.drawer.mode = 'side';
        this.drawer.opened = true;
        this.sidenavFullsize = false;
      }
    }
  }
}
