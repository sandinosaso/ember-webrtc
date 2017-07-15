import Ember from 'ember';
import SocketIo1xConnection from '../utils/SocketIo1xConnection';

var socketUrl = location.origin.replace(/^http/, 'ws'); //http://localhost:8888
var socketPort = '8888';

export default Ember.Service.extend(Ember.Evented, {

    sessionManager: null,
    localMedia: null,
    connectionReady: false,
    store: Ember.inject.service(),


    init() {
        this._super(...arguments);
        const sessionManager = new SimpleWebRTC({
            remoteVideosEl: null,
            nick: 'xander1',
            localVideoEl: null,
            autoRequestMedia: false,
            connection: new SocketIo1xConnection({
                url: socketUrl,
                port: socketPort,
                socketio: {'force new connection':true},
            })
        });

        this.set('sessionManager', sessionManager);

        console.log('webrtc:',this.get('sessionManager.webrtc'));

    },

     connectToRoom(room) {
        const activeRoom = this.get('activeRoom');
        const sessionManager = this.get('sessionManager');
        if (!room || room === activeRoom) {
            return;
        }
        if (activeRoom) {
            sessionManager.leaveRoom(activeRoom);
        }
        this.get('sessionManager').joinRoom('emberjs');
    }
});
