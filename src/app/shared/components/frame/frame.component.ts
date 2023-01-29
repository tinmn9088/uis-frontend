import {
  AfterViewInit,
  Component,
  HostListener,
  Input,
  ViewChild,
} from '@angular/core';
import {
  MatDrawerContainer,
  MatDrawerContent,
} from '@angular/material/sidenav';

@Component({
  selector: 'app-frame[options]',
  templateUrl: './frame.component.html',
  styleUrls: ['./frame.component.scss'],
})
export class FrameComponent implements AfterViewInit {
  @Input() options?: { title: string; path: string; isActive: boolean }[];
  @ViewChild(MatDrawerContainer) drawerContainer!: MatDrawerContainer;
  @ViewChild(MatDrawerContent) drawerContent!: MatDrawerContent;
  contentHeightPixels?: number;

  ngAfterViewInit(): void {
    setTimeout(() => this.updateContentHeight(), 0);
  }

  @HostListener('window:resize')
  onResize() {
    this.updateContentHeight();
  }

  updateContentHeight() {
    this.contentHeightPixels = (
      this.drawerContainer as any
    )._element.nativeElement.offsetHeight;
  }
}
