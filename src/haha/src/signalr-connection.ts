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
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(URL)
            .withAutomaticReconnect()
            .build();

        // Start the connection
        this.connection.start()
            .then(() => {
                console.log("Connected to SignalR hub");
            })
            .catch(err => document.write(err));

        // Define the events method to listen for messages
        this.events = (onMessageReceived, onLocationUpdated, onGameCreated, onGameJoined) => {
            // Listen for the "messageReceived" event
            this.connection.on("messageReceived", (username, message) => {
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
