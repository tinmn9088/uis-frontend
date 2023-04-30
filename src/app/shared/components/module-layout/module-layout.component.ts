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
import { ModuleSidenavOption } from '../../domain/module-sidenav-option';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { ModuleService } from '../../services/module.service';
import { ModuleName } from '../../domain/module-name';
import { THEME_CSS_CLASS_TOKEN } from '../../shared.module';
import { ToolbarTab } from '../../domain/toolbar-tab';

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
  contentHeightPixels?: number;
  sidenavFullsize = true;
  showToolbarTabs = true;
  isContentHidden = true;
  sidenavOptions!: ModuleSidenavOption[];
  activeOption?: ModuleSidenavOption;
  toolbarTabs!: ToolbarTab[];
  activeTab?: ToolbarTab;
  addButtonPath?: string;
  @ViewChild(MatDrawerContainer) drawerContainer!: MatDrawerContainer;
  @ViewChild(MatDrawerContent) drawerContent!: MatDrawerContent;
  @ViewChild(MatDrawer) drawer!: MatDrawer;

  constructor(
    private _breakpointObserver: BreakpointObserver,
    private _router: Router,
    private _moduleService: ModuleService,
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
        this.isContentHidden = true;
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
        this.addButtonPath =
          this._moduleService.getSidenavAddButtonPath(moduleName);

        setTimeout(() => {
          this.isContentHidden = false;
        }, 200);
      }
    });
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

  isSidenavOptionHidden(option: ModuleSidenavOption): boolean {
    if (option === this.activeOption) return false;
    const group = this.sidenavOptions.filter(
      other => other.groupId === option.groupId
    );
    if (group.find(optionFromGroup => optionFromGroup === this.activeOption)) {
      return true;
    }
    return option !== group[0];
  }

  private isActiveOption(currentPath: string, option: ModuleSidenavOption) {
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
