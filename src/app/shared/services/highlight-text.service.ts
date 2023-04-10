import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HighlightTextService {
  readonly CLASS_NAME = 'hightlight-text';

  readonly TAGNAMES_TO_SKIP = ['mat-icon', 'thead'];

  highlight(text: string, element: Element | null) {
    if (!element) return;
    const children = element.children;
    if (children.length === 0) {
      let innerHTML = element.innerHTML;
      if (text && innerHTML) {
        innerHTML = innerHTML.replaceAll(
          new RegExp(text, 'gi'),
          match => `<span class='${this.CLASS_NAME}'>${match}</span>`
        );
        element.innerHTML = innerHTML;
      }
    } else {
      for (let i = 0; i < children.length; i++) {
        if (
          this.TAGNAMES_TO_SKIP.filter(
            tagName =>
              tagName.toLocaleLowerCase() ===
              children.item(i)?.tagName.toLocaleLowerCase()
          ).length === 0
        )
          this.highlight(text, children.item(i));
      }
    }
  }
}
