import Ember from 'ember';
import $ from 'jquery';

const {
    computed,
    get,
    set
} = Ember;

export default Ember.Component.extend({
    classNames: ['video-chat'],
    inVideo: false,
    videoService: Ember.inject.service('video-chat'),

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
            this.$('video.local')[0].src = URL.createObjectURL(stream);
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
