# URL Shortening Service with Socket.IO

This is a URL shortening service that uses Socket.IO for real-time communication. It allows users to shorten a URL and receive the shortened URL via a Socket.IO connection. This project is built using Node.js, Express, and Socket.IO.

Here is the Postman Documentation:
https://documenter.getpostman.com/view/6235120/2sAYQcEVsT

## Features

- **URL Shortening**: Users can shorten a URL by sending a `POST` request.
- **Real-Time Notification**: Once a URL is shortened, the user receives the shortened URL via Socket.IO.
- **Singleton Controller**: The `UrlController` follows the Singleton design pattern to manage the URL shortening logic.
- **In-Memory Storage**: The shortened URL mappings are stored in memory for simplicity.

## Technologies Used

- **Node.js**: The runtime environment.
- **Express.js**: Web framework for building RESTful APIs.
- **Socket.IO**: For real-time communication between server and client.
- **TypeScript**: For type safety and maintainability.
- **Singleton Pattern**: Ensures only one instance of `UrlController`.
- **In-memory Storage**: Stores shortened URL mappings in memory.

## Installation

### Prerequisites

Make sure you have the following installed:
- Node.js
- npm or yarn

### Steps

1. Clone this repository:

    ```bash
    git clone https://github.com/yourusername/url-shortening-service.git
    cd url-shortening-service
    ```

2. Install dependencies:

   Using npm:

    ```bash
    npm install
    ```

   Or using yarn:

    ```bash
    yarn install
    ```

3. Run the application:

    ```bash
    npm run dev
    ```

   Or if you're using yarn:

    ```bash
    yarn dev
    ```

4. The server should now be running on `http://localhost:3000`.

## Endpoints

### `POST /url`

Shortens a given URL and sends the shortened URL via Socket.IO.

#### Request:

- **Body** (JSON):

    ```json
    {
        "url": "https://www.example.com"
    }
    ```

#### Response:

- **Status 202**:

    ```json
    {
        "message": "You should receive a shortened URL via Socket.IO shortly"
    }
    ```

### `GET /url/:shortCode`

Retrieves the original URL for a given shortened URL code.

#### Request:

- **URL Parameter**: `shortCode` (The shortened URL code)

#### Response:

- **Status 200**:

    ```json
    {
        "url": "https://www.example.com"
    }
    ```

- **Status 400** (if shortCode is missing):

    ```json
    {
        "error": "Short code is required"
    }
    ```

- **Status 404** (if URL not found):

    ```json
    {
        "error": "URL not found"
    }
    ```

## Socket.IO Communication

### Example Socket.IO Client (client.ts)

You can create a simple client to test the WebSocket communication using Socket.IO. Here's a sample client implementation:
The command to run to test after building the app, should be:

 ```bash
    node dist/client.js
 ```

```typescript
import io from 'socket.io-client';

// Connect to the Socket.IO server
const socket = io('http://localhost:4500');  // Replace with your WebSocket server URL

socket.on('connect', () => {
    console.log('Connected to Socket.IO server');
});

socket.on('shortenedURL', (shortenedURL: string) => {
    console.log('Received shortened URL:', shortenedURL);  // Logs the shortened URL from the server
});

socket.on('disconnect', () => {
    console.log('Disconnected from Socket.IO server');
});
```
