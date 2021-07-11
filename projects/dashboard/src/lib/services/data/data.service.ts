import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { of, combineLatest, Observable } from 'rxjs';
import { switchMap, take, catchError, map, tap } from 'rxjs/operators';

import { DashboardPart, DatabaseItem } from '../config/config.service';
import { DashboardService } from '../dashboard/dashboard.service';

import { GetPart, ChangeStatus, AddItem, UpdateItem, UpdateBatch, DeleteItem } from '../../states/database/database.state';

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
    const batchResult = {} as Record<string, any[]>;
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
    const allEfffects = !effectedUpdates.length ? of([]) : combineLatest(
      effectedUpdates.map(data =>
        this.store.dispatch(new GetPart(data.effectPart as DashboardPart))
      )
    )
    .pipe(
      take(1),
      // get database
      switchMap(states => {
        const {database} = states.pop();
        // extract updates
        const allUpdates = effectedUpdates
          .map(data => {
            const {id, item: newData, effectPart, effectKey} = data;
            // all items by part
            const batch = (database[(effectPart as DashboardPart).name] as DatabaseItem[])
              // filter by property
              .filter(item => !!item[effectKey]?.[id])
              // set update
              .map(item =>
                ({
                  id: item.id,
                  data: {
                    [effectKey]: {
                      ...item[effectKey],
                      [id]: newData,
                    }
                  },
                })
              );
            // update batch
            batchResult[(effectPart as DashboardPart).name] = []; // init result
            return this.store.dispatch(
              new UpdateBatch(
                effectPart as DashboardPart,
                batch,
                batchResult[(effectPart as DashboardPart).name]
              )
            );
          });
        // run all update (ignore error)
        return combineLatest(allUpdates);
      }),
    );
    // update item and effects
    return this.store.dispatch(new UpdateItem(part, id, data)).pipe(
      take(1),
      switchMap(() => allEfffects),
      map(() => ({ id, batchResult })),
    );
  }

  archiveItem(part: DashboardPart, origin: string) {
    // TODO: remove effects
    const yes = confirm('Archive item?');
    if (yes) {
      return this.changeStatusByOrigin(part, origin, 'archive');
    } else {
      return of(null);
    }
  }

  unarchiveItem(part: DashboardPart, origin: string) {
    const yes = confirm('Unarchive item?');
    if (yes) {
      return this.changeStatusByOrigin(part, origin, 'draft');
    } else {
      return of(null);
    }
  }

  removeItem(part: DashboardPart, origin: string) {
    // TODO: remove effects
    const yes = confirm('Trash item?');
    if (yes) {
      return this.changeStatusByOrigin(part, origin, 'trash');
    } else {
      return of(null);
    }
  }

  restoreItem(part: DashboardPart, origin: string) {
    const yes = confirm('Restore item?');
    if (yes) {
      return this.changeStatusByOrigin(part, origin, 'draft');
    } else {
      return of(null);
    }
  }

  deletePermanently(part: DashboardPart, origin: string) {
    // TODO: remove effects
    const yes = confirm('Delete permanently?');
    if (yes) {
      return this.store.dispatch(new DeleteItem(part, origin));
    } else {
      return of(null);
    }
  }

  private changeStatusByOrigin(part: DashboardPart, origin: string, status: string) {
    return this.store.dispatch(new ChangeStatus(part, origin, status));
  }

}
