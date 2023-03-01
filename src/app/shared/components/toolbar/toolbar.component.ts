import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
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
  selector: 'app-toolbar[tabs][activeTab]',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit, AfterViewInit {
  private _resizeObserver: ResizeObserver;
  readonly languages = Language;
  addMenuItems = [
    { text: 'toolbar.menu.add.category', path: '/' },
    { text: 'toolbar.menu.add.discipline', path: '/' },
    { text: 'toolbar.menu.add.specialization', path: '/' },
    { text: 'toolbar.menu.add.curricula', path: '/' },
  ];
  compact = false;
  user?: User;
  @Input() tabs!: ModuleToolbarTab[];
  @Input() activeTab?: ModuleToolbarTab;
  @Input() showTabs = true;
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

  ngOnInit() {
    this.user = {
      login: 'Пользователь1',
      roles: ['admin', 'guest'],
    };
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
