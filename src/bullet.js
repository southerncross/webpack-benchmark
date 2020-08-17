const MSG_TYPES = {
  HEARTBEAT: 0,
  BULLET: 1,
};

const HEARTBEAT_INTERVAL = 10000; // 10s

class Bullet {
  constructor(host, onMessage) {
    this.host = host;
    this.connection = null;
    this.onMessage = onMessage;
    this.heartbeatTimer = null;
  }

  init = () => {
    if (this.connection && this.connection.readyState <= WebSocket.OPEN) {
      return;
    }

    this.connection = new WebSocket(this.host);
    this.connection.addEventListener('open', this.onOpen);
    this.connection.addEventListener('close', this.onClose);
    this.connection.addEventListener('message', this.onMessage);
  }

  uninit = () => {
    if (this.connection.readyState >= WebSocket.CLOSING) {
      return;
    }

    this.connection.removeEventListener('message', this.onMessage);
    this.connection.removeEventListener('close', this.onClose);
    this.connection.removeEventListener('open', this.onOpen);
    this.connection.close();
  }

  heartbeat = () => {
    if (this.connection.readyState === WebSocket.OPEN) {
      this.connection.send(MSG_TYPES.HEARTBEAT);
    }
  }

  onOpen = () => {
    this.heartbeatTimer = setInterval(this.heartbeat, HEARTBEAT_INTERVAL);
  };

  onClose = () => {
    clearInterval(this.heartbeatTimer);
  }

  send = (message) => {
    if (this.connection.readyState === WebSocket.OPEN) {
      this.connection.send(MSG_TYPES.BULLET + message);
    }
  }
}

export default Bullet;
