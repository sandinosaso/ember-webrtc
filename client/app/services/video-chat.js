import Ember from 'ember';

const {
  inject: { service },
  get
} = Ember;

export default Ember.Service.extend(Ember.Evented, {

    sessionManager: null,
    localMedia: null,
    connectionReady: false,
    store: service(),
    webrtc: service(),
    skylink: service(),
    useSkyLink: true,

    init() {
        this._super(...arguments);
        if (!get(this, 'useSkyLink')) {
          const sessionManager = get(this, 'webrtc.sessionManager');

          sessionManager.on('connectionReady', () => this.set('connectionReady', true));
          sessionManager.on('createdPeer', this.createdPeer.bind(this));
          sessionManager.on('message', this.trigger.bind(this));
          sessionManager.webrtc.on('peerStreamAdded', this.videoAdded.bind(this));
          sessionManager.webrtc.on('peerStreamRemoved', this.videoRemoved.bind(this));

          this.set('sessionManager', sessionManager);
          this.on('localMediaStarted', this.connectToRoom.bind(this));

          window.videochat = this;

          get(this, 'store').push({
            data: [{
              id: 'xander1',
              type: 'person',
              attributes: {
                name: 'xander1'
              },
              relationships: {}
            }, {
              id: 'xander2',
              type: 'person',
              attributes: {
                name: 'xander2'
              },
              relationships: {}
            }]
          });

          this.set('sessionManager', sessionManager);
        }else {
          const skylink = get(this, 'skylink');
          const sessionManager = get(this, 'skylink.skylink');

          this.set('connectionReady', true);

          this.on('localMediaStarted', this.connectToRoom.bind(this));
          sessionManager.on('connectionReady', () => this.set('connectionReady', true));
          sessionManager.on('createdPeer', this.createdPeer.bind(this));
          sessionManager.on('message', this.trigger.bind(this));
          sessionManager.on('peerStreamAdded', this.videoAdded.bind(this));
          sessionManager.on('peerStreamRemoved', this.videoRemoved.bind(this));


          skylink.on('peerJoined', (peerId, peerInfo, isSelf) => {
            debugger;
            if(isSelf) return; // We already have a video element for our video and don't need to create a new one.
            var vid = document.createElement('video');
            vid.autoplay = true;
            vid.muted = true; // Added to avoid feedback when testing locally
            vid.id = peerId;
            document.body.appendChild(vid);

          });

          // skylink.on('incomingStream', function(peerId, stream, isSelf) {
          //   debugger;
          //   if(isSelf) return;
          //   var vid = document.getElementById(peerId);
          //   attachMediaStream(vid, stream);
          // });

          skylink.on("incomingStream", function (peerId, stream, peerInfo, isSelf) {
            if (isSelf) {
              attachMediaStream(document.getElementById("myvideo"), stream);
            } else {
              var peerVideo = document.createElement("video");
              peerVideo.id = peerId;
              peerVideo.autoplay = "autoplay";
              document.getElementById("peersVideo").appendChild(peerVideo);
              attachMediaStream(peerVideo, stream);
            }
          });

          skylink.on('peerLeft', function(peerId) {
            var vid = document.getElementById(peerId);
            document.body.removeChild(vid);
          });

          skylink.on('mediaAccessSuccess', function(stream) {
            var vid = document.getElementById('myvideo');
            attachMediaStream(vid, stream);
          });

          this.set('sessionManager', skylink);
        }


    },

    joinRoom(media) {
        const sessionManager = get(this, 'sessionManager');

        debugger;

        if (!get(this, 'useSkyLink')) {
          sessionManager.webrtc.startLocalMedia(media, (err, stream) => {
              if (err) {
                  this.trigger('mediaError', err);
              } else {
                  this.set('localMedia', stream);
                  this.trigger('localMediaStarted', stream);
              }
          });
        }else {
          let skylink = sessionManager.skylink;

          skylink.init({
            apiKey: '7b2459b0-d8e1-444b-9003-adbe6fd5588a',
            defaultRoom: 'sandinosaso241401u4140124u12031u312'
          }, function() {
            skylink.joinRoom({
              audio: true,
              video: true
            });
          });


        }
    },

    pauseVideo(){
        const sessionManager = this.get('sessionManager');

        if (!get(this, 'useSkyLink')) {
          sessionManager.webrtc.pause();
        }else {

        }
    },

    resumeVideo(){
        const sessionManager = this.get('sessionManager');
        if (!get(this, 'useSkyLink')) {
          sessionManager.webrtc.resume();
        }
    },

    muteAudio(){
        const sessionManager = this.get('sessionManager');
        if (!get(this, 'useSkyLink')) {
          sessionManager.webrtc.mute();
        }
    },

    unMuteAudio(){
        const sessionManager = this.get('sessionManager');
        if (!get(this, 'useSkyLink')) {
          sessionManager.webrtc.unmute();
        }
    },

    leaveRoom() {
        const localMedia = this.get('localMedia');
        localMedia.getTracks().forEach(t => t.stop());
        this.get('sessionManager').leaveRoom(this.get('activeRoom'));
        this.set('activeRoom', false);
    },

    connectToRoom(room) {
        const activeRoom = get(this, 'activeRoom');
        const sessionManager = get(this, 'sessionManager');
        if (!room || room === activeRoom) {
            return;
        }
        if (activeRoom) {
            sessionManager.leaveRoom(activeRoom);
        }

        sessionManager.joinRoom('emberjs');
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
    },

    createdPeer(peer) {
    }
});
