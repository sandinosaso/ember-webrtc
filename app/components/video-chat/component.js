import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['video-chat'],
    inVideo: false,
    videoService: Ember.inject.service('video-chat'),

    participants: [],

    init() {
        this._super(...arguments);
        const videoService = this.get('videoService');


        videoService.on('localMediaStarted', this.localMediaStarted.bind(this));
        videoService.on('videoAdded', this.videoAdded.bind(this));
        videoService.on('videoRemoved', this.videoRemoved.bind(this));

        window.thething = this;
    },

    actions: {
        joinVideo() {
            this.set('inVideo', true);
            this.get('videoService').joinRoom();
        },

        leaveVideo() {
            this.set('inVideo', false);
            this.get('videoService').leaveRoom();
        }
    },

    localMediaStarted(stream) {
        Ember.run.scheduleOnce('afterRender', this, function() {
            this.$('video.local')[0].src = URL.createObjectURL(stream);
        });
    },

    videoAdded(person) {
        this.get('participants').addObject(person);
        Ember.run.scheduleOnce('afterRender', this, function() {
            const peerVideoEl = this.$(`video[data-peer-id='${person.peer.id}']`)[0];
            peerVideoEl.src = URL.createObjectURL(person.peer.stream);
        });
    },

    videoRemoved(person) {
        this.get('participants').removeObject(person);
    }
});
