import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HighlightTextService {
  readonly CLASS_NAME = 'hightlight-text';

  highlight(text: string, element: Element) {
    this.hightlightRecursive(text, element);
  }

  hightlightRecursive(text: string, root: Element | null) {
    if (!root) return;
    const children = root.children;
    if (children.length === 0) {
      let innerHTML = root.innerHTML;
      if (text && innerHTML) {
        innerHTML = innerHTML.replaceAll(
          text,
          `<span class='${this.CLASS_NAME}'>${text}</span>`
        );
        root.innerHTML = innerHTML;
      }
    } else {
      for (let i = 0; i < children.length; i++) {
        this.hightlightRecursive(text, children.item(i));
      }
    }
  }
}
