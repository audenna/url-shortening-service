import { Server, Socket } from "socket.io";
import webSocketManager from "../../src/websocket/WebSocketManager";
import { ISocketResponse } from "../../src/types";

describe("WebSocketManager", () => {
    let mockIo: Partial<Server>;
    let mockSocket: Partial<Socket>;
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
        consoleSpy = jest.spyOn(console, 'log').mockImplementation();

        mockSocket = {
            id: 'testSocket',
            handshake: {
                headers: {"client-id": "testClientId"},
                time: "",
                address: "",
                xdomain: false,
                secure: false,
                issued: 0,
                url: "",
                query: undefined as any,
                auth: {}
            },
            disconnected: false,
            emit: jest.fn(),
            on: jest.fn(),
            disconnect: jest.fn(),
        };

        mockIo = {
            on: jest.fn((event, callback) => {
                if (event === "connection") {
                    callback(mockSocket);
                }
            }) as any
        };
    });

    afterAll(() => jest.clearAllMocks());

    it("should initialize WebSocket server and set up listeners", () => {
        webSocketManager.initialize(mockIo as Server);

        expect(mockIo.on).toHaveBeenCalledWith("connection", expect.any(Function));
        expect(consoleSpy).toHaveBeenCalledWith("Socket.IO client connected");
    });

    it("should add socket client and store it in clients map", () => {
        webSocketManager.initialize(mockIo as Server);
        const client = webSocketManager.getConnectedClientByIdentifier("testClientId");

        expect(client).toBe(mockSocket);
        expect(consoleSpy).toHaveBeenCalledWith("WebSocket client set to: testClientId");
    });

    it("should remove socket client on disconnection", () => {
        webSocketManager.initialize(mockIo as Server);
        webSocketManager["removeSocketClient"]("testClientId");
        const client = webSocketManager.getConnectedClientByIdentifier("testClientId");

        expect(client).toBeNull();
    });

    it("should log an error if adding a socket client with no socket", () => {
        webSocketManager["addSocketClient"](null);

        expect(consoleSpy).toHaveBeenCalledWith("Invalid or disconnected WebSocket client");
    });

    // it("should log an error if client does not have an ID", () => {
    //     const invalidSocket = { ...mockSocket, handshake: { headers: {} } };
    //     webSocketManager["addSocketClient"](invalidSocket as Socket);
    //
    //     expect(consoleSpy).toHaveBeenCalledWith("Client does not have a client ID");
    // });
});
