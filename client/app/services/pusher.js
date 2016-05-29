import Ember from 'ember';
import ENV from 'ember-webrtc/config/environment';
import Pusher from 'npm:pusher-js';


export default Ember.Service.extend({
  init() {
    this._super(...arguments);

    this.set('pusher', new Pusher(ENV.APP.PUSHER.key, {
      encrypted: true,
    }));

    let channel = this.get('pusher').subscribe('messages');

    this.set('channel', channel);
  },

  sendMessage(message){
    let channel = this.get('channel');
    channel.trigger('new_message', message);
  },

  onMessage(fn) {
    const channel = this.get('pusher').subscribe('messages');
    channel.bind('new_message', fn);
  }
});
