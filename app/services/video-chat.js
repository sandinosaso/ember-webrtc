import Ember from 'ember';
import SocketIo1xConnection from '../utils/SocketIo1xConnection';

export default Ember.Service.extend(Ember.Evented, {

    sessionManager: null,
    localMedia: null,
    connectionReady: false,
    store: Ember.inject.service(),

    init() {
        this._super(...arguments);
        const sessionManager = new SimpleWebRTC({
            remoteVideosEl: null,
            nick: 'xander',
            localVideoEl: null,
            autoRequestMedia: false,
            connection: new SocketIo1xConnection({
                url: 'http://192.168.1.45:8888',
                port: '8888',
                socketio: {'force new connection':true},
            })
        });

        sessionManager.on('connectionReady', () => this.set('connectionReady', true));
        sessionManager.on('createdPeer', this.createdPeer.bind(this));
        sessionManager.on('message', this.trigger.bind(this));
        sessionManager.webrtc.on('peerStreamAdded', this.videoAdded.bind(this));
        sessionManager.webrtc.on('peerStreamRemoved', this.videoRemoved.bind(this));

        this.set('sessionManager', sessionManager);
        this.on('localMediaStarted', this.connectToRoom.bind(this));

        window.videochat = this;
        this.get('store').pushPayload({people: [ { id: 'xander', name: 'Xander' } ] });
    },

    joinRoom(media) {
        const sessionManager = this.get('sessionManager');
        sessionManager.webrtc.startLocalMedia(media, (err, stream) => {
            if (err) {
                this.trigger('mediaError', err);
            } else {
                this.set('localMedia', stream);
                this.trigger('localMediaStarted', stream);
            }
        });
    },

    pauseVideo(){
        const sessionManager = this.get('sessionManager');
        sessionManager.webrtc.pause();
    },

    resumeVideo(){
        const sessionManager = this.get('sessionManager');
        sessionManager.webrtc.resume();
    },

    muteAudio(){
        const sessionManager = this.get('sessionManager');
        sessionManager.webrtc.mute();
    },

    unMuteAudio(){
        const sessionManager = this.get('sessionManager');
        sessionManager.webrtc.unmute();
    },

    leaveRoom() {
        const localMedia = this.get('localMedia');
        localMedia.getTracks().forEach(t => t.stop());
        this.get('sessionManager').leaveRoom(this.get('activeRoom'));
        this.set('activeRoom', false);
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
    },

    createdPeer(peer) {

    },

    videoAdded(peer) {
        this.get('store').find('person', peer.nick).then((person) => {
            person.set('peer', peer);
            this.trigger('videoAdded', person);
        });
    },

    videoRemoved(peer) {
        this.get('store').find('person', peer.nick).then((person) => {
            this.trigger('videoRemoved', person);
        });
    }
});
