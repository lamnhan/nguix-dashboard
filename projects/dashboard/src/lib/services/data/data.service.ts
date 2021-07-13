import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { of, combineLatest, Observable } from 'rxjs';
import { switchMap, take, catchError, map, tap } from 'rxjs/operators';

import { DashboardPart, DatabaseItem, UpdateEffect } from '../config/config.service';
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

  addItem(
    part: DashboardPart,
    id: string,
    data: any,
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) {
    (!part.dataService ? of(false) : part.dataService.exists(id))
    .pipe(
      take(1),
      switchMap(exists => {
        if (exists) {
          throw new Error('Item exists with the id: ' + id);
        }
        return this.store.dispatch(new AddItem(part, id, data));
      }),
    )
    .subscribe(onSuccess, onError);
  }

  updateItem(
    part: DashboardPart,
    id: string,
    data: any,
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) {
    const batchResult = {} as Record<string, any[]>;
    // filter effects
    const effectedUpdates = this.getEffectedUpdates(
      part,
      effect => !!effect.props.filter(prop => !!data[prop]).length,
    );
    // get all data
    const allEfffects = this.runBatchUpdate(
      effectedUpdates,
      batchResult,
      id,
      effect => effect.props.reduce(
        (result, prop) => {
          if (data[prop]) {
            result[prop] = data[prop];
          }
          return result;
        },
        { id } as Record<string, any>,
      ),
    );
    // update item and effects
    this.store.dispatch(new UpdateItem(part, id, data))
    .pipe(
      take(1),
      switchMap(() => allEfffects),
      map(() => ({ id, batchResult })),
    )
    .subscribe(onSuccess, onError);
  }

  archiveItem(
    part: DashboardPart,
    origin: string,
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) {
    const yes = confirm('Archive item?');
    if (!yes) {
      return;
    }
    const batchResultById = {} as Record<string, Record<string, any[]>>;
    // filter effects
    const effectedUpdates = this.getEffectedUpdates(part);
    // update item and effects 
    const allEfffects = this.store.dispatch(new GetPart(part)).pipe(
      tap(console.log),
      switchMap(state => {
        console.log(state);
        const {database} = state;
        return combineLatest(
          (database[part.name] as any[])
            .filter(item => item.origin === origin)
            .map(item => {
              console.log({origin, item});
              const {id} = item;
              batchResultById[id] = {} as Record<string, any[]>;
              return this.runBatchUpdate(
                effectedUpdates,
                batchResultById[id],
                id,
                null
              );
            })
        );
      }),
    );
    this.store.dispatch(new ChangeStatus(part, origin, 'archive'))
    .pipe(
      take(1),
      switchMap(() => allEfffects),
      map(() => batchResultById),
      tap(console.log),
    )
    .subscribe(onSuccess, onError);
  }

  unarchiveItem(
    part: DashboardPart,
    origin: string,
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) {
    const yes = confirm('Unarchive item?');
    if (!yes) {
      return;
    }
    this.store.dispatch(new ChangeStatus(part, origin, 'draft'))
    .pipe(take(1))
    .subscribe(onSuccess, onError);
  }

  removeItem(
    part: DashboardPart,
    origin: string,
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) {
    // TODO: remove effects
    const yes = confirm('Trash item?');
    if (!yes) {
      return;
    }
    this.store.dispatch(new ChangeStatus(part, origin, 'trash'))
    .pipe(take(1))
    .subscribe(onSuccess, onError);
  }

  restoreItem(
    part: DashboardPart,
    origin: string,
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) {
    const yes = confirm('Restore item?');
    if (!yes) {
      return;
    }
    this.store.dispatch(new ChangeStatus(part, origin, 'draft'))
    .pipe(take(1))
    .subscribe(onSuccess, onError);
  }

  deletePermanently(
    part: DashboardPart,
    origin: string,
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) {
    // TODO: remove effects
    const yes = confirm('Delete permanently?');
    if (!yes) {
      return;
    }
    this.store.dispatch(new DeleteItem(part, origin))
    .pipe(take(1))
    .subscribe(onSuccess, onError);
  }

  private getEffectedUpdates(
    part: DashboardPart,
    filter?: (effect: UpdateEffect) => boolean
  ) {
    return (part.updateEffects || [])
      .filter(effect => !filter ? true : filter(effect))
      .map(effect => {
        const effectedPart = this.dashboardService.getPart(effect.part);
        return { effect, effectedPart };
      })
      .filter(data => !!data.effectedPart) as Array<{effect: UpdateEffect, effectedPart: DashboardPart}>;
  }

  private runBatchUpdate(
    effectedUpdates: Array<{effect: UpdateEffect, effectedPart: DashboardPart}>,
    batchResult: Record<string, any[]>,
    sourceId: string,
    newDataBuilder: null | {(effect: UpdateEffect): Record<string, any>}
  ) {
    return !effectedUpdates.length ? of([]) : combineLatest(
      effectedUpdates.map(effectedUpdate =>
        this.store.dispatch(new GetPart(effectedUpdate.effectedPart as DashboardPart))
      )
    )
    .pipe(
      take(1),
      // get database
      switchMap(states => {
        const {database} = states.pop();
        // extract updates
        const allUpdates = effectedUpdates
          .map(effectedUpdate => {
            const { effect, effectedPart } = effectedUpdate;
            const { key: effectedKey, idBuilder } = effect;
            const recordKey = !idBuilder ? sourceId : idBuilder(sourceId);
            const makeBatchData = (item: DatabaseItem) => {
              const newData = newDataBuilder === null ? null : newDataBuilder(effect);
              const batchData = {
                id: item.id,
                data: {
                  [effectedKey]: {
                    ...item[effectedKey],
                    [recordKey]: newData,
                  }
                },
              };
              if (newData === null) {
                delete batchData.data[effectedKey][recordKey];
              }
              return batchData;
            }
            // new data
            // all items by part
            const batch = (database[(effectedPart as DashboardPart).name] as DatabaseItem[])
              // filter by property
              .filter(item => !!item[effectedKey]?.[recordKey])
              // set update
              .map(item => makeBatchData(item));
            // update batch
            batchResult[(effectedPart as DashboardPart).name] = []; // init result
            return this.store.dispatch(
              new UpdateBatch(
                effectedPart as DashboardPart,
                batch,
                batchResult[(effectedPart as DashboardPart).name]
              )
            );
          });
        // run all update (ignore error)
        return combineLatest(allUpdates);
      }),
    );
  }
}
