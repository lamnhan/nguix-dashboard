import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { of, combineLatest } from 'rxjs';
import { switchMap, take, catchError, map, tap } from 'rxjs/operators';

import { DashboardPart } from '../config/config.service';
import { DashboardService } from '../dashboard/dashboard.service';

import { GetPart, ChangeStatus, AddItem, UpdateItem } from '../../states/database/database.state';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private store: Store,
    private dashboardService: DashboardService,
  ) {}
  
  previewItem(part: DashboardPart) {
    alert('// TODO: Preview ...');
  }

  addItem(part: DashboardPart, id: string, data: any) {
    return (!part.dataService ? of(false) : part.dataService.exists(id))
      .pipe(
        switchMap(exists => {
          if (exists) {
            throw new Error('Item exists with the id: ' + id);
          } else {
            return this.store.dispatch(new AddItem(part, id, data));
          }
        }),
      );
  }

  updateItem(part: DashboardPart, id: string, data: any) {
    // filter effects
    const effectedUpdates = (part.updateEffects || [])
      .filter(effect => !!effect.props.filter(prop => !!data[prop]).length)
      .map(effect => {
        const item = effect.props.reduce(
          (result, prop) => {
            if (data[prop]) {
              result[prop] = data[prop];
            }
            return result;
          },
          { id } as Record<string, any>,
        );
        const effectPart = this.dashboardService.getPart(effect.part);
        return { id, item, effectPart, effectKey: effect.key };
      })
      .filter(data => !!data.effectPart);
    // get all data
    const allEfffects = combineLatest(effectedUpdates.map(data =>
      this.store.dispatch(new GetPart(data.effectPart as DashboardPart))
    ))
    .pipe(
      take(1),
      // get database
      switchMap(result => {
        const {database} = result.pop();
        const allUpdates = effectedUpdates
          .map(data => {
            const {id, item: newData, effectPart, effectKey} = data;
            // all items by part
            return (database[(effectPart as DashboardPart).name] as any[])
              // filter prop
              .filter(item => !!item[effectKey]?.[id])
              // set update
              .map(item => {
                // new prop value
                const updates = {
                  [effectKey]: {
                    ...item[effectKey],
                    [id]: newData,
                  }
                };
                // save observable
                return this.store.dispatch(
                  new UpdateItem(effectPart as DashboardPart, item.id, updates)
                );
              });
          })
          // turn [[Observale,...],[Observale,...]] => [Observale,...]
          .reduce(
            (result, updates) => {
              result = result.concat(updates);
              return result;
            },
            [] as any[],
          );
        // run all update (ignore error)
        return !allUpdates.length
          // no effect
          ? of(null)
          // all effect
          : combineLatest(allUpdates).pipe(catchError(() => of(null)));
      }),
    );
    // main item
    return this.store.dispatch(new UpdateItem(part, id, data))
      // all effects
      .pipe(
        take(1),
        switchMap(() => allEfffects)
      );
  }

  archiveItem(part: DashboardPart, origin: string) {
    // TODO: remove effects
    const yes = confirm('Archive item?');
    if (yes) {
      this.changeStatusByOrigin(part, origin, 'archive');
    }
  }

  unarchiveItem(part: DashboardPart, origin: string) {
    const yes = confirm('Unarchive item?');
    if (yes) {
      this.changeStatusByOrigin(part, origin, 'draft');
    }
  }

  removeItem(part: DashboardPart, origin: string) {
    // TODO: remove effects
    const yes = confirm('Trash item?');
    // TODO: include delete permanently in the confirm alert
    if (yes) {
      this.changeStatusByOrigin(part, origin, 'trash');
    }
  }

  restoreItem(part: DashboardPart, origin: string) {
    const yes = confirm('Restore item?');
    if (yes) {
      this.changeStatusByOrigin(part, origin, 'draft');
    }
  }

  private changeStatusByOrigin(part: DashboardPart, origin: string, status: string) {
    this.store.dispatch(new ChangeStatus(part, origin, status));
  }

}
