let socketServerUrl = window.location.protocol + "//" +
    window.location.hostname + ":" +
    window.location.port + "/";

let socketClient = io.connect(socketServerUrl);

if (socketClient) {
    socketClient.on('NewCustomerRecord',
        message => {
            console.info('Notification Received ... ' +
                JSON.stringify(message));
        });
}