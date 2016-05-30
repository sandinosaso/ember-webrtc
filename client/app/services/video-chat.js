import Ember from 'ember';
import SocketIo1xConnection from '../utils/SocketIo1xConnection';

const {
  get
} = Ember;

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
            media: { audio: true, video: true },
            connection: new SocketIo1xConnection({
                url: 'http://localhost:8888',
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
        this.get('store').push({
          data: {
            id: '1',
            type: 'person',
            attributes: {
              name: 'xander1'
            }
          }
        });
    },

    joinRoom(media) {
        const sessionManager = this.get('sessionManager');
        sessionManager.webrtc.startLocalMedia(media, (err, stream) => {
            if (err) {
                this.trigger('mediaError', err);
            } else {
                this.set('localMedia', stream);
                this.trigger('localMediaStarted', stream);
                this.trigger('createdPeer', stream);
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

    // createdPeer(peer) {
    //     // receiving an incoming filetransfer
    //     peer.on('fileTransfer', function (metadata, receiver) {
    //         console.log('incoming filetransfer', metadata.name, metadata);
    //         receiver.on('progress', function (bytesReceived) {
    //             console.log('receive progress', bytesReceived, 'out of', metadata.size);
    //         });
    //         // get notified when file is done
    //         receiver.on('receivedFile', function (file, metadata) {
    //             console.log('received file', metadata.name, metadata.size);

    //             // close the channel
    //             receiver.channel.close();
    //         });
    //     });
    // },

    createdPeer(peer) {
      let sessionManager = get(this, 'sessionManager');
      console.log('createdPeer', peer);
      var remotes = document.getElementById('remotes');
      if (!remotes) return;
      var container = document.createElement('div');
      container.className = 'peerContainer';
      container.id = 'container_' + peer.id;

      // show the peer id
      var peername = document.createElement('div');
      peername.className = 'peerName';
      peername.appendChild(document.createTextNode('Peer: ' + peer.id));
      container.appendChild(peername);

      // show a list of files received / sending
      var filelist = document.createElement('ul');
      filelist.className = 'fileList';
      container.appendChild(filelist);

      // show a file select form
      var fileinput = document.createElement('input');
      fileinput.type = 'file';

      // send a file
      fileinput.addEventListener('change', function() {
          fileinput.disabled = true;

          var file = fileinput.files[0];
          var sender = peer.sendFile(file);

          // create a file item
          var item = document.createElement('li');
          item.className = 'sending';

          // make a label
          var span = document.createElement('span');
          span.className = 'filename';
          span.appendChild(document.createTextNode(file.name));
          item.appendChild(span);

          span = document.createElement('span');
          span.appendChild(document.createTextNode(file.size + ' bytes'));
          item.appendChild(span);

          // create a progress element
          var sendProgress = document.createElement('progress');
          sendProgress.max = file.size;
          item.appendChild(sendProgress);

          // hook up send progress
          sender.on('progress', function (bytesSent) {
              sendProgress.value = bytesSent;
          });
          // sending done
          sender.on('sentFile', function () {
              item.appendChild(document.createTextNode('sent'));

              // we allow only one filetransfer at a time
              fileinput.removeAttribute('disabled');
          });
          // receiver has actually received the file
          sender.on('complete', function () {
              // safe to disconnect now
          });
          filelist.appendChild(item);
      }, false);
      fileinput.disabled = 'disabled';
      container.appendChild(fileinput);

      // show the ice connection state
      if (peer && peer.pc) {
          var connstate = document.createElement('div');
          connstate.className = 'connectionstate';
            container.appendChild(connstate);
            peer.pc.on('iceConnectionStateChange', function (event) {
                var state = peer.pc.iceConnectionState;
                console.log('state', state);
                container.className = 'peerContainer p2p' + state.substr(0, 1).toUpperCase()
                    + state.substr(1);
                switch (state) {
                case 'checking':
                    connstate.innerText = 'Connecting to peer...';
                    break;
                case 'connected':
                case 'completed': // on caller side
                    connstate.innerText = 'Connection established.';
                    // enable file sending on connnect
                    fileinput.removeAttribute('disabled');
                    break;
                case 'disconnected':
                    connstate.innerText = 'Disconnected.';
                    break;
                case 'failed':
                    // not handled here
                    break;
                case 'closed':
                    connstate.innerText = 'Connection closed.';

                    // disable file sending
                    fileinput.disabled = 'disabled';
                    // FIXME: remove container, but when?
                    break;
                }
            });
        }
        remotes.appendChild(container);

            // receiving an incoming filetransfer
            peer.on('fileTransfer', function (metadata, receiver) {
                console.log('incoming filetransfer', metadata);
                var item = document.createElement('li');
                item.className = 'receiving';

                // make a label
                var span = document.createElement('span');
                span.className = 'filename';
                span.appendChild(document.createTextNode(metadata.name));
                item.appendChild(span);

                span = document.createElement('span');
                span.appendChild(document.createTextNode(metadata.size + ' bytes'));
                item.appendChild(span);

                // create a progress element
                var receiveProgress = document.createElement('progress');
                receiveProgress.max = metadata.size;
                item.appendChild(receiveProgress);

                // hook up receive progress
                receiver.on('progress', function (bytesReceived) {
                    receiveProgress.value = bytesReceived;
                });
                // get notified when file is done
                receiver.on('receivedFile', function (file, metadata) {
                    console.log('received file', metadata.name, metadata.size);
                    var href = document.createElement('a');
                    href.href = URL.createObjectURL(file);
                    href.download = metadata.name;
                    href.appendChild(document.createTextNode('download'));
                    item.appendChild(href);

                    // close the channel
                    receiver.channel.close();
                });
                filelist.appendChild(item);
            });
    },

    // sendFile(peer) {
    //   // show a list of files received / sending
    //   var filelist = document.createElement('ul');
    //   filelist.className = 'fileList';
    //   document.appendChild(filelist);

    //   // show a file select form
    //   var fileinput = document.createElement('input');
    //   fileinput.type = 'file';

    //   fileinput.addEventListener('change', function() {
    //       fileinput.disabled = true;

    //       var item = document.createElement('li');
    //       // make a label
    //       var span = document.createElement('span');
    //       span.className = 'filename';
    //       span.appendChild(document.createTextNode(file.name));
    //       item.appendChild(span);

    //       span = document.createElement('span');
    //       span.appendChild(document.createTextNode(file.size + ' bytes'));
    //       item.appendChild(span);

    //       // create a progress element
    //       var sendProgress = document.createElement('progress');
    //       sendProgress.max = file.size;
    //       item.appendChild(sendProgress);

    //       var file = fileinput.files[0];
    //       var sender = peer.sendFile(file);

    //       // hook up send progress
    //       sender.on('progress', function (bytesSent) {
    //           sendProgress.value = bytesSent;
    //       });
    //       // sending done
    //       sender.on('sentFile', function () {
    //           item.appendChild(document.createTextNode('sent'));

    //           // we allow only one filetransfer at a time
    //           fileinput.removeAttribute('disabled');
    //       });
    //       // receiver has actually received the file
    //       sender.on('complete', function () {
    //           // safe to disconnect now
    //       });
    //       filelist.appendChild(item);

    //   });
    // },

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
