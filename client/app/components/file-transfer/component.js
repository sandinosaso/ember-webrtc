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
    classNames: ['file-transfer'],
    fileService: service('file-transfer'),
    currentUserService: service('current-user'),

    init() {
        this._super(...arguments);
        //const fileService = get(this, 'fileService');

        window.thething = this;
        get(this, 'fileService').joinRoom();
    },

    actions: {
        startFileSharing() {
            get(this, 'fileService').joinRoom();
        },
    }
});
