import Ember from 'ember';
import $ from 'jquery';
import hark from 'npm:hark';



const {
    computed,
    get,
    set,
    inject: { service },
} = Ember;

export default Ember.Component.extend({
    classNames: ['video-chat'],
    inVideo: false,
    videoService: service('video-chat'),
    currentUserService: service('current-user'),

    participants: [],

    init() {
        this._super(...arguments);
        const videoService = get(this, 'videoService');


        videoService.on('localMediaStarted', this.localMediaStarted.bind(this));
        videoService.on('videoAdded', this.videoAdded.bind(this));
        videoService.on('videoRemoved', this.videoRemoved.bind(this));

        window.thething = this;
    },

    isVideoOn: computed({
      get() {
        return false;
      }
    }),

    isAudioOn: computed({
      get() {
        return false;
      }
    }),

    myVideoClass: computed({
      get() {
        return 'video-big';
      }
    }),

    participantsVideoClass: computed({
      get() {
        return 'video-big';
      }
    }),

    actions: {
        joinVideo() {
            set(this, 'inVideo', true);
            get(this, 'videoService').joinRoom();

            $("#message-list").css('height', '150px');
            $(".top-bar").css('height', '90%');
        },

        leaveVideo() {
            set(this, 'inVideo', false);
            get(this, 'videoService').leaveRoom();

            $("#message-list").css('height', '440px');
            $(".top-bar").css('height', '50px');
        },

        pauseVideo(){
            get(this, 'videoService').pauseVideo();
            set(this, 'isVideoOn', false);
        },

        resumeVideo(){
            get(this, 'videoService').resumeVideo();
            set(this, 'isVideoOn', true);
        },

        muteAudio(){
            get(this, 'videoService').muteAudio();
            set(this, 'isAudioOn', false);
        },

        unMuteAudio(){
            get(this, 'videoService').unMuteAudio();
            set(this, 'isAudioOn', true);
        }
    },

    localMediaStarted(stream) {
        Ember.run.scheduleOnce('afterRender', this, function() {
            this.$('#myvideo')[0].src = URL.createObjectURL(stream);
        });

        let options = {};
        let speechEvents = hark(stream, options);

        speechEvents.on('speaking', () => {
          if (get(this, 'isAudioOn')){
            set(this, 'myVideoClass', 'video-big');
            set(this, 'participantsVideoClass', 'video-small');
            console.log('speaking');
          }
        });

        speechEvents.on('stopped_speaking', () => {
          if (get(this, 'isAudioOn')){
            set(this, 'myVideoClass', 'video-small');
            set(this, 'participantsVideoClass', 'video-big');
            console.log('stopped_speaking');
          }
        });

    },

    videoAdded(person) {
        get(this, 'participants').addObject(person);
        Ember.run.scheduleOnce('afterRender', this, function() {
            const peerVideoEl = this.$(`video[data-peer-id='${person.peer.id}']`)[0];
            peerVideoEl.src = URL.createObjectURL(person.peer.stream);
        });
    },

    videoRemoved(person) {
        get(this, 'participants').removeObject(person);
    }
});
