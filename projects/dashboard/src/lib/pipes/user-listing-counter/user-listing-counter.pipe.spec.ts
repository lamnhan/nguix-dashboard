import { UserListingCounterPipe } from './user-listing-counter.pipe';

describe('UserListingCounterPipe', () => {
  it('create an instance', () => {
    const pipe = new UserListingCounterPipe();
    expect(pipe).toBeTruthy();
  });
});
