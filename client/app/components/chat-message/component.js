import Ember from 'ember';

const {
  computed,
  Component,
  get
} = Ember;

export default Component.extend({
  timestamp: computed('message.time', {
    get() {
      return strftime('%H:%M:%S %P', new Date(get(this, 'message').time));
    }
  }),
  text: Ember.computed('message.text', function() {
    return this.get('message').text;
  }),
});
