import { Pipe, PipeTransform } from '@angular/core';
import { HelperService } from '@lamnhan/ngx-useful';

@Pipe({
  name: 'linkingFilter'
})
export class LinkingFilterPipe implements PipeTransform {

  constructor(private helperService: HelperService) {}

  transform(
    items: any[],
    contentType?: string,
    contentLocale?: string,
    query?: string,
    isAnyType = false,
    isAnyLocale = false,
    isAnyStatus = false,
  ): any[] {
    return items
      .filter(item => isAnyType || !contentType ? true : item.type === contentType)
      .filter(item => isAnyLocale || !contentLocale ? true : item.locale === contentLocale)
      .filter(item => isAnyStatus ? true : item.status === 'publish')
      .filter(item => {
        if(!query) {
          return true;
        } else {
          const EOL = ' | ';
          const { id, title, description, keywords, locale: itemLocale } = item;
          let text = 
            (id + EOL + id.replace(/\-|\_/g, ' ') + EOL) +
            (!title ? '' : (title + EOL)) +
            (!description ? '' : (description + EOL)) +
            (!keywords ? '' : keywords);
          text = text +
            (EOL + text.toLowerCase()) +
            (itemLocale !== 'vi-VN' ? '' : EOL + this.helperService.cleanupStr(text));
          return text.indexOf(query) !== -1;
        }
      });
  }

}
