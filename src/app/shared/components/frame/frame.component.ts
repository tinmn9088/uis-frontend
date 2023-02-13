import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  MatDrawer,
  MatDrawerContainer,
  MatDrawerContent,
} from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { distinctUntilChanged } from 'rxjs';
import { ModuleSidenavOption } from '../../domain/module-sidenav-option';

@Component({
  selector: 'app-frame[sidenavOptions][activeOption][toolbarTabs][activeTab]',
  templateUrl: './frame.component.html',
  styleUrls: ['./frame.component.scss'],
})
export class FrameComponent implements OnInit, AfterViewInit {
  private readonly BREAKPOINT = '(min-width: 768px)';
  private readonly _breakpoint$ = this._breakpointObserver
    .observe([this.BREAKPOINT])
    .pipe(distinctUntilChanged());
  private _resizeObserver: ResizeObserver;
  contentHeightPixels?: number;
  sidenavFullsize = true;
  showToolbarTabs = true;
  @Input() sidenavOptions!: ModuleSidenavOption[];
  @Input() activeOption?: ModuleSidenavOption;
  @Input() toolbarTabs!: ModuleSidenavOption[];
  @Input() activeTab?: ModuleSidenavOption;
  @Input() addButtonPath?: string;
  @ViewChild(MatDrawerContainer) drawerContainer!: MatDrawerContainer;
  @ViewChild(MatDrawerContent) drawerContent!: MatDrawerContent;
  @ViewChild(MatDrawer) drawer!: MatDrawer;

  constructor(private _breakpointObserver: BreakpointObserver) {
    this._resizeObserver = new ResizeObserver(entries => {
      this.contentHeightPixels = entries[0]?.contentRect.height;
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
