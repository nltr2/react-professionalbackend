"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketNotificationService = void 0;
const INVALID_SOCKET_SERVER = "Invalid Socket IO Server Configuration Provided!";
class SocketNotificationService {
    constructor(socketIOServer) {
        if (!socketIOServer) {
            throw new Error(INVALID_SOCKET_SERVER);
        }
        this.socketIOServer = socketIOServer;
    }
    notify(eventName, payload) {
        const validation = payload !== null &&
            this.socketIOServer !== null &&
            eventName !== null;
        if (validation) {
            this.socketIOServer.emit(eventName, payload);
        }
    }
}
exports.SocketNotificationService = SocketNotificationService;
//# sourceMappingURL=socket-notification-service.js.map