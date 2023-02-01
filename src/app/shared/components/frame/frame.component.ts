import {
  AfterViewInit,
  Component,
  HostListener,
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

@Component({
  selector: 'app-frame[options]',
  templateUrl: './frame.component.html',
  styleUrls: ['./frame.component.scss'],
})
export class FrameComponent implements OnInit, AfterViewInit {
  private readonly BREAKPOINT = '(min-width: 768px)';
  private readonly _breakpoint$ = this._breakpointObserver
    .observe([this.BREAKPOINT])
    .pipe(distinctUntilChanged());
  contentHeightPixels?: number;
  sidenavFullsize = true;
  showToolbarTabs = true;
  @Input() options?: { title: string; path: string; isActive: boolean }[];
  @ViewChild(MatDrawerContainer) drawerContainer!: MatDrawerContainer;
  @ViewChild(MatDrawerContent) drawerContent!: MatDrawerContent;
  @ViewChild(MatDrawer) drawer!: MatDrawer;

  constructor(private _breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    this._breakpoint$.subscribe(() => this.onBreakpointChange());
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.updateContentHeight(), 0);
    setTimeout(() => this.onBreakpointChange(), 0);
  }

  @HostListener('window:resize')
  onResize() {
    this.updateContentHeight();
  }

  onDrawerOpenedStart() {
    const compact = !this._breakpointObserver.isMatched(this.BREAKPOINT);
    if (compact) {
      this.showToolbarTabs = false;
    }
    setTimeout(() => this.updateContentHeight(), 0);
  }

  onDrawerClosedStart() {
    const compact = !this._breakpointObserver.isMatched(this.BREAKPOINT);
    if (compact) {
      this.showToolbarTabs = true;
    }
    setTimeout(() => this.updateContentHeight(), 0);
  }

  private updateContentHeight() {
    this.contentHeightPixels = (
      this.drawerContainer as any
    )._element.nativeElement.offsetHeight;
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
