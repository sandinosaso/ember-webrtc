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

  mouseEnter: function() {
    if (!get(this, 'isOpen')){
      this.toggleProperty('isOpen');
    }
  },

  actions: {
    toggleChat() {
      this.toggleProperty('isOpen');
    },
  }
});
