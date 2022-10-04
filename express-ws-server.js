import express from "express";

// core module http - no npm install
import http from "http";

// use webSocket server
import { WebSocketServer } from "ws";

// import functions
import { parseJSON, broadcast, broadcastButExclude } from "./libs/functions.js";



/* Application variables - set port numer and make sure client hs uses same websocket port */

const port = 80;




/* Express */

// express 'app' environment
const app = express();

// serve static files - every file in folder named public
app.use(express.static("public"));




/* Servers */

// use core module http and pass express as an instance
const server = http.createServer(app);

// create websocket server - use a predefined server
const wss = new WebSocketServer({ noServer: true });



/* Allow websockets - listener */ 

// upgrade event - websocket communication
server.on("upgrade", (req, socket, head) => {
    console.log("Upgrade event client: ", req.headers);

    // start websocket
    wss.handleUpgrade(req, socket, head, (ws) => {
        console.log("Let user use websocket");

        wss.emit("connection", ws, req);
    });

});



/* Listen on new websocket connections */
wss.on("connection", (ws) => {
    console.log("New client connection from IP: ", ws._socket.remoteAddress);
    console.log("Number of connected clients: ", wss.clients.size);

    // Websocket events (ws) for a single client

    // close event
    ws.on("close", () => {
        console.log("Client disconnected");
        console.log("Number of remaining clients: ", wss.clients.size);
    
});

    // message event
    ws.on("message", (data) => {
    console.log("Message received: %s", data);

    let obj = parseJSON(data);

    // todo
    // use obj property "type" to handle message event
    switch (obj.type) {
        case "text": 
            break;
        case "somethingelse":
            break;
        default: 
            break; 
    }

    // message to clients
    let objBroadcast = {
        type: "text", 
        msg: obj.msg,
        nickname: obj.nickname
    };

    // broadcast to all ut this ws
    broadcastButExclude(wss, ws, objBroadcast);
  }); 
});

/* Listen on initial connection */

server.listen(port, (req, res) => {
    console.log(`Express server and http running on port ${port}`);
});
