// invy/pipes/markdown.pipe.ts
import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

// marked
import { marked } from 'marked';

@Pipe({
  name: 'markdown',
  standalone: false,
})
export class MarkdownPipe implements PipeTransform {
  // TODO: INYECCIONES
  private readonly sanitizer = inject(DomSanitizer);

  transform ( value: string | null | undefined ): SafeHtml {
    if ( !value ) return '';
    const html = marked.parse(value, { async: false }) as string;
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
