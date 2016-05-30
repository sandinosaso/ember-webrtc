import Ember from 'ember';

const {
  computed,
  Component,
  get,
} = Ember;

export default Component.extend({
  isOpen: false,
  currentUserService: Ember.inject.service('current-user'),


  userName: computed('currentUserService.user', {
    get() {
      return get(this, 'currentUserService.user');
    }
  }),

  actions: {
    toggleChat() {
      this.toggleProperty('isOpen');
    },
  }
});
