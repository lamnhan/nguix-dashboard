import { Injectable } from '@angular/core';
import { of, combineLatest } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { State, Action, StateContext } from '@ngxs/store';

export interface MediaStateModel {
  files: any[];
}

export class GetMedia {
  static readonly type = '[Media] Get all items';
  constructor() {}
}

@State<MediaStateModel>({
  name: 'media',
  defaults: {
    files: [],
  },
})
@Injectable()
export class MediaState {

  constructor() {}

  @Action(GetMedia)
  getMedia({ getState, patchState }: StateContext<MediaStateModel>, action: GetMedia) {
    const state = getState();
  }

}
