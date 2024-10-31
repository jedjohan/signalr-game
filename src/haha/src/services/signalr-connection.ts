import * as signalR from "@microsoft/signalr";
import { LocationUpdateData } from '../components/LocationUpdates';

const URL = process.env.HUB_ADDRESS ?? "https://localhost:8080/hub";
const CONNECT_URL = 'https://localhost:8080/connect';

class Connector {
  private connection: signalR.HubConnection;
  private static instance: Connector;
  private eventsInitialized = false; // Add this flag

  public events: (
    onMessageReceived: (username: string, message: string) => void,
    onLocationUpdated: (data: LocationUpdateData) => void,
    onGameCreated: (gameData: any) => void,
    onPlayerJoined: (gameData: any) => void,
  ) => void;

  private constructor() {
    const builder = new signalR.HubConnectionBuilder()
      .withUrl(URL)
      .withStatefulReconnect({ bufferSize: 1000 });
    this.connection = builder.build();

    this.connection.onreconnecting((error) => {
      console.warn(`Connection lost due to ${error?.message}. Reconnecting...`);
    });

    this.connection.onreconnected((connectionId) => {
      console.log(`Reconnected with new connectionId: ${connectionId}`);
    });

    this.connection.onclose((error) => {
      console.error(`Connection closed due to error: ${error?.message}`);
    });

    this.connection.start()
    .then(() => {
        fetch(`${CONNECT_URL}`, {
            method: 'GET',
            headers: {
                "device-id": "dacoolheaderdeviceid"
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("GET request successful, data received:", data);
            })
            .catch(error => {
                console.error("Error with GET request:", error);
            });

        console.log("Connected to SignalR hub");
    })
    .catch(err => document.write(err));

    // Ensure events are only initialized once
    this.events = (onMessageReceived, onLocationUpdated, onGameCreated, onPlayerJoined) => {
      if (!this.eventsInitialized) {
        this.connection.on("ConnectedDevice", (username, message) => {
          console.log(`Received message from ${username}: ${message}`);
          onMessageReceived(username, message);
        });

        this.connection.on("LocationUpdate", (data) => {
          const parsedData: LocationUpdateData = JSON.parse(data);
          console.log(parsedData);
          onLocationUpdated(parsedData);
        });

        this.connection.on("GameCreated", (gameData) => {
          console.log("Game created event received:", gameData);
          onGameCreated(gameData);
        });

        this.connection.on("PlayerJoined", (gameData) => {
          console.log("Game joined event received:", gameData);
          onPlayerJoined(gameData);
        });

        this.eventsInitialized = true; // Set the flag to true
      }
    };
  }

  public newMessage = (messages: string) => {
    this.connection.send("newMessage", "foo", messages)
      .then(() => console.log("Message sent"))
      .catch(err => console.error("Error sending message:", err));
  }

  public static getInstance(): Connector {
    if (!Connector.instance) {
      Connector.instance = new Connector();
    }
    return Connector.instance;
  }
}

export default Connector.getInstance();
