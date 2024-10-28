import * as signalR from "@microsoft/signalr";
const URL = process.env.HUB_ADDRESS ?? "https://localhost:8080/hub";

class Connector {
    private connection: signalR.HubConnection;
    public events: (
        onMessageReceived: (username: string, message: string) => void,
        onLocationUpdated: (data: string) => void,
        onGameCreated: (gameData: any) => void,
        onGameJoined: (gameData: any) => void,
    ) => void;
    static instance: Connector;

    constructor() {
        const builder = new signalR.HubConnectionBuilder()
        .withUrl(URL)
        .withStatefulReconnect({ bufferSize: 1000 });
        this.connection = builder.build();

            this.connection.onreconnecting((error) => {
                console.warn(`Connection lost due to ${error?.message}. Reconnecting...`);
                // Optionally, notify the user that the connection is lost and the client is attempting to reconnect.
            });
    
            // Handle successful reconnection
            this.connection.onreconnected((connectionId) => {
                console.log(`Reconnected with new connectionId: ${connectionId}`);
                // You might need to re-sync session data or send a signal to the server that the client is back.
                // For example, re-send team updates, location updates, etc.
            });
    
            // Handle connection closed permanently (when reconnection attempts fail)
            this.connection.onclose((error) => {
                console.error(`Connection closed due to error: ${error?.message}`);
                // Handle the permanent loss of connection, e.g., notify the user and offer a retry button
            });

        // Start the connection
        this.connection.start()
            .then(() => {
                console.log("Connected to SignalR hub");
            })
            .catch(err => document.write(err));

        // Define the events method to listen for messages
        this.events = (onMessageReceived, onLocationUpdated, onGameCreated, onGameJoined) => {
            // Listen for the "messageReceived" event
            this.connection.on("ReceiveMessage", (username, message) => {
                console.log(`Received message from ${username}: ${message}`); // Log the received message
                onMessageReceived(username, message); // Call the provided callback
            });

            // Listen for the "LocationUpdate" event
            this.connection.on("LocationUpdate", (data) => {
                const parsedData = JSON.parse(data); // Parse the incoming data
                console.log(parsedData); // Use parsedData instead
                onLocationUpdated(parsedData);
            });

            // Listen for the "GameCreated" event (new event listener)
            this.connection.on("GameCreated", (gameData) => {
                console.log("Game created event received:", gameData); // Log the game data
                onGameCreated(gameData); // Call the provided callback with gameData
            });

            // Listen for the "GameCreated" event (new event listener)
            this.connection.on("TeamJoinedGame", (gameData) => {
                console.log("Game joined event received:", gameData); // Log the game data
                onGameJoined(gameData); // Call the provided callback with gameData
            });
        };
    }

    public newMessage = (messages: string) => {
        this.connection.send("newMessage", "foo", messages)
            .then(() => console.log("Message sent"))
            .catch(err => console.error("Error sending message:", err));
    }

    public static getInstance(): Connector {
        if (!Connector.instance)
            Connector.instance = new Connector();
        return Connector.instance;
    }
}

export default Connector.getInstance;
