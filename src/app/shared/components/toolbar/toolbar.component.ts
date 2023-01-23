import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

declare type Tab = {
  title: string;
  path: string;
};

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  tabs: Tab[] = [
    { title: 'Tab 1', path: '/' },
    { title: 'Tab 2', path: '/path2' },
    { title: 'Tab 3', path: '/specializations/list' },
  ];
  activeTab = this.tabs[0];
  @Output() menuButtonClick = new EventEmitter();

  constructor(private _router: Router) {}

  onTabClick(tab: Tab) {
    this.activeTab = tab;
    this._router.navigateByUrl(tab.path);
  }

  onMenuClick() {
    this.menuButtonClick.emit();
  }
}
