import { INotificationService } from "./inotification-service";
import socketIO from 'socket.io';

const INVALID_SOCKET_SERVER = "Invalid Socket IO Server Configuration Provided!";

class SocketNotificationService implements INotificationService {
    private socketIOServer: socketIO.Server;

    constructor(socketIOServer: socketIO.Server) {
        if (!socketIOServer) {
            throw new Error(INVALID_SOCKET_SERVER);
        }

        this.socketIOServer = socketIOServer;
    }

    notify(eventName: string, payload: any): void {
        const validation = payload !== null &&
            this.socketIOServer !== null &&
            eventName !== null;

        if (validation) {
            this.socketIOServer.emit(eventName, payload);
        }
    }
}

export {
    SocketNotificationService
};
