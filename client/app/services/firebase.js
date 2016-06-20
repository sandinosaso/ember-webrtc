import Ember from 'ember';
import ENV from 'ember-webrtc/config/environment';

const {
  inject: { service }
} = Ember;


export default Ember.Service.extend({
  store : service(),

  init() {
    this._super(...arguments);


  },

  sendMessage(message){

  }

  // onMessage(fn) {
  //   const channel = this.get('pusher').subscribe('messages');
  //   channel.bind('new_message', fn);
  // }
});
