import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../user/models/user';
import { Language } from '../../domain/language';
import { LanguageService } from '../../services/language.service';
import { ModuleToolbarTab } from '../../domain/module-tab';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements AfterViewInit {
  private _resizeObserver: ResizeObserver;
  readonly languages = Language;
  addMenuItems = [
    { text: 'toolbar.menu.add.category', path: '/' },
    { text: 'toolbar.menu.add.discipline', path: '/' },
    { text: 'toolbar.menu.add.specialization', path: '/' },
    { text: 'toolbar.menu.add.curricula', path: '/' },
  ];
  compact = false;
  @Input() user?: User;
  @Input() tabs: ModuleToolbarTab[] = [];
  @Input() activeTab?: ModuleToolbarTab;
  @Input() showTabs = false;
  @Input() showBurger = false;
  @Input() showAddMenu = false;
  @Output() menuButtonClick = new EventEmitter();
  @ViewChild(MatToolbar) matToolbar!: MatToolbar;

  constructor(
    public languageService: LanguageService,
    private _router: Router
  ) {
    this._resizeObserver = new ResizeObserver(entries => {
      this.onResize(entries[0]?.contentRect.width);
    });
  }

  ngAfterViewInit() {
    this._resizeObserver.observe(this.matToolbar._elementRef.nativeElement);
  }

  onTabClick(tab: ModuleToolbarTab) {
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
}
