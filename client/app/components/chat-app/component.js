import Ember from 'ember';

const {
  computed,
  Component,
  get,
} = Ember;

export default Component.extend({
  currentUserService: Ember.inject.service('current-user'),
  nameIsSet: computed('currentUserService.user', {
    get() {
      return get(this, 'currentUserService').hasUser();
    }
  }),

  userName: computed('currentUserService.user', {
    get() {
      return get(this, 'currentUserService.user');
    }
  })
});
