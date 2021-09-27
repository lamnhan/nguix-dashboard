import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import * as Tagify from '@yaireo/tagify';
import { Tag } from '@lamnhan/schemata';
import { DatabaseData, HelperService, UserService } from '@lamnhan/ngx-useful';

import { DashboardPart } from '../../services/config/config.service';

@Component({
  selector: 'nguix-dashboard-tag-editor',
  templateUrl: './tag-editor.component.html',
  styleUrls: ['./tag-editor.component.scss']
})
export class TagEditorComponent implements OnInit, OnDestroy {
  @Input() formGroup!: FormGroup;
  @Input() currentData?: Record<string, any>;
  @Input() sourcePart!: DashboardPart;
  @Input() destinationPart!: DashboardPart;
  @Input() preload?: number;
  @Input() activeLocale!: string;
  @Input() activeType!: string;
  @Input() typeFilter?: Record<string, string>;

  @Output() save = new EventEmitter<any>();

  @ViewChild('tagify') private set tagifyEl(ref: ElementRef) {
    setTimeout(() => {
      this.tagifyInstance = new Tagify(ref.nativeElement);
      this.setTags();
    }, 0);
  };

  private tagifyInstance!: Tagify;
  private activeTags: string[] = [];

  constructor(
    private helperService: HelperService,
    private userService: UserService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy() {
    this.tagifyInstance.destroy();
  }

  onChanges() {
    if (!this.destinationPart.dataService) return;
    const { newTags, toAdd, toRemove } = this.getTagChanges();
    const items$ = (this.destinationPart.dataService as DatabaseData<Tag>).getItems(
      newTags.map(tag => this.helperService.slugify(tag))
    );
    // on change
    if (toAdd) {
      const id = this.helperService.slugify(toAdd);
      this.destinationPart.dataService.get(id)
      .pipe(
        switchMap(item => {
          const uid = this.userService.uid || '';
          const createdAt = new Date().toISOString();
          const title = toAdd;
          const doc: Tag = {
            uid,
            id,
            title,
            type: 'default',
            status: 'publish',
            createdAt,
            updatedAt: createdAt,
            count: 0,
          };
          return item
            // exists
            ? of(item)
            // create new
            : (this.destinationPart.dataService as DatabaseData<Tag>)
              .create(id, doc).pipe(map(() => doc));
        }),
        switchMap(item =>
          (this.destinationPart.dataService as DatabaseData<Tag>)
            .onLinking('create', item, this.getLinkingContext())
        ),
        switchMap(() => items$),
      )
      .subscribe(items =>
        this.save.emit(this.getLinkingResult(items))
      );
    }
    // on remove
    if (toRemove) {
      const id = this.helperService.slugify(toRemove);
      this.destinationPart.dataService.get(id)
      .pipe(
        switchMap(item =>
          (this.destinationPart.dataService as DatabaseData<Tag>)
            .onLinking('delete', item, this.getLinkingContext())
        ),
        switchMap(() => items$),
      )
      .subscribe(items =>
        this.save.emit(this.getLinkingResult(items))
      );
    }
    // update active tags
    this.activeTags = newTags;
  }

  getLinkingResult(items: Tag[]) {
    if (!this.destinationPart.dataService) {
      return;
    }
    const dataPickers = this.destinationPart.dataService.getDataPickers();
    const linkingFields = this.destinationPart.dataService.getLinkingFields();
    return items.reduce(
      (result, item) => {
        const id = item.id;
        const data = linkingFields.reduce(
          (result2, prop) => {
            const value = !dataPickers[prop]
              ? (item as any)[prop]
              : dataPickers[prop]((item as any)[prop], item);
            if (value !== undefined && value !== null) {
              result2[prop] = value;
            }
            return result2;
          },
          {} as any,
        );
        // set result
        result[id] = data;
        // return result
        return result;
      },
      {} as Record<string, any>,
    );
  }

  private setTags() {
    if (this.tagifyInstance && this.currentData) {
      this.activeTags = Object
        .keys(this.currentData)
        .map(id => (this.currentData as any)[id].title as string);
      this.tagifyInstance.addTags(this.activeTags);
    }
  }

  private getTagChanges() {
    const oldTags = this.activeTags;
    const newTags = this.tagifyInstance
      .getCleanValue()
      .map(item => item.value);
    const toRemove = oldTags.filter(tag => !newTags.includes(tag)).pop();
    const toAdd = newTags.filter(tag => !oldTags.includes(tag)).pop();
    return { newTags, toAdd, toRemove };
  }

  private getLinkingContext() {
    return {
      collection: (this.sourcePart.dataService as DatabaseData<any>).name,
      data: this.getDataSnapshot(),
    };
  }

  private getDataSnapshot() {
    return Object.keys(this.formGroup.controls).reduce(
      (result, name) => {
        const control = this.formGroup.controls[name];
        const value = control.value;
        result[name] = !isNaN(value) ? +value : value;
        return result;
      },
      {} as Record<string, any>
    );
  }
}
