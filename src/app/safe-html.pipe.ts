import { Pipe, PipeTransform } from '@angular/core';
import { Sanitizer } from '@angular/core';
import { Component, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private _sanitizer: DomSanitizer){}

  transform(value: any, args?: any): any {
    return this._sanitizer.bypassSecurityTrustHtml(value);
  }

}
