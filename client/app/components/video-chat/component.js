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
    isSpeaking: false,
    videoService: service('video-chat'),
    currentUserService: service('current-user'),

    agents: [{
      id: 1,
      name: 'Agent1',
      email: 'sandinosaso@gmail.com',
      profile_image: 'sandinosaso',
      active: true,
      activeFrom: '03:00:00',
      activeTo: '20:00:00',
    },
    {
      id: 2,
      name: 'Agent2',
      email: 'sandinosaso@gmail.com',
      profile_image: 'luissuarez9',
      active: true,
      activeFrom: '03:00:00',
      activeTo: '20:00:00',
    },
    {
      id: 3,
      name: 'Agent3',
      email: 'sandinosaso@gmail.com',
      profile_image: 'aybuenota',
      active: true,
      activeFrom: '03:00:00',
      activeTo: '20:00:00',
    }
  ],

    // checkAgents() {
    //   return new Ember.RSVP.Promise((resolve, reject) => {
    //         Ember.$.ajax({
    //             url: 'api/agents',
    //             type: 'GET',
    //             contentType: 'application/json;charset=utf-8',
    //             dataType: 'json'
    //         }).then(function(response) {
    //             Ember.run(function() {
    //                 resolve({
    //                     response: response
    //                 });
    //             });
    //         }, function(xhr) {
    //             var response = xhr.responseText;
    //             Ember.run(function() {
    //                 reject(response);
    //             });
    //         });
    //     });
    // },

    init() {
        this._super(...arguments);
        const videoService = get(this, 'videoService');

        videoService.on('localMediaStarted', this.localMediaStarted.bind(this));
        videoService.on('videoAdded', this.videoAdded.bind(this));
        videoService.on('videoRemoved', this.videoRemoved.bind(this));

        window.thething = this;
    },

    // agents: computed({
    //   get() {
    //     let agents = this.checkAgents();
    //     agents.then((result) => {
    //       // on fulfillment
    //       return result.response.agents;
    //     }, () => {
    //       // on rejection
    //       return [];
    //     });
    //   }
    // }),

    participants: computed({
      get() {
        return [];
      }
    }),

    isVideoOn: computed({
      get() {
        return true;
      }
    }),

    isAudioOn: computed({
      get() {
        return true;
      }
    }),

    myVideoClass: computed('participants.[]', {
      get() {
        return get(this, 'participants.length') > 0 ? 'video-small' : 'video-big';
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

            $("#message-list").removeClass('message-list-big').addClass('message-list-small');
            $(".top-bar").removeClass('top-bar-small').addClass('top-bar-big');
        },

        leaveVideo() {
            set(this, 'inVideo', false);
            get(this, 'videoService').leaveRoom();

            $("#message-list").removeClass('message-list-small').addClass('message-list-big');
            $(".top-bar").removeClass('top-bar-big').addClass('top-bar-small');
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
        },

        closeChat(){
          get(this, 'closeChat')();
        }
    },

    localMediaStarted(stream) {
        Ember.run.scheduleOnce('afterRender', this, function() {
          this.$('#myvideo')[0].src = URL.createObjectURL(stream);
        });

        let options = {};
        let speechEvents = hark(stream, options);

        speechEvents.on('speaking', () => {
          this.toggleProperty('isSpeaking');
        });

        speechEvents.on('stopped_speaking', () => {
          set(this, 'isSpeaking', false);
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
