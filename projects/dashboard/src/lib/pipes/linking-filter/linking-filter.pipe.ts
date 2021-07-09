import { Pipe, PipeTransform } from '@angular/core';
import { HelperService } from '@lamnhan/ngx-useful';

@Pipe({
  name: 'linkingFilter'
})
export class LinkingFilterPipe implements PipeTransform {

  constructor(private helperService: HelperService) {}

  transform(
    items: any[],
    locale: string,
    query?: string,
    isAnyLocale = false,
    isAnyStatus = false,
  ): any[] {
    return items
      .filter(item => isAnyLocale ? true : item.locale === locale)
      .filter(item => isAnyStatus ? true : item.status === 'publish')
      .filter(item => {
        if(!query) {
          return true;
        } else {
          const EOL = ' | ';
          const { title, description, keywords, locale: itemLocale } = item;
          let text = 
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
