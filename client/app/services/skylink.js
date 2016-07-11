import Ember from 'ember';


export default Ember.Service.extend(Ember.Evented, {

    skylink: null,
    localMedia: null,
    connectionReady: false,
    store: Ember.inject.service(),

    init() {
        this._super(...arguments);
        const skylink = new Skylink();

        this.set('skylink', skylink);
    },

     connectToRoom(room) {
        const activeRoom = this.get('activeRoom');
        const skylink = this.get('skylink');
        debugger;

        if (!room || room === activeRoom) {
            return;
        }
        if (activeRoom) {
            skylink.leaveRoom(activeRoom);
        }

        skylink.init({
          apiKey: '7b2459b0-d8e1-444b-9003-adbe6fd5588a',
          defaultRoom: 'sandinosaso'
        }, function() {
          skylink.joinRoom({
            audio: true,
            video: true
          });
        });

    }
});
