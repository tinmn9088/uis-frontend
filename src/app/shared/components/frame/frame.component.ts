import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-frame[options]',
  templateUrl: './frame.component.html',
  styleUrls: ['./frame.component.scss'],
})
export class FrameComponent {
  @Input() options?: { title: string; path: string }[];
}
