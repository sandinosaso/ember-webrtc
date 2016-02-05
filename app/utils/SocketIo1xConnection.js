/* global io */

class SocketIo1xConnection {
    constructor(config) {
        this.connection = io.connect(config.url, config.socketio);
    }

    on(ev, fn) {
        this.connection.on(ev, fn);
    }

    emit() {
        this.connection.emit.apply(this.connection, arguments);
    }

    getSessionid() {
        return this.connection.io.engine.id;
    }

    disconnect() {
        return this.connection.disconnect();
    }
}

export default SocketIo1xConnection;
