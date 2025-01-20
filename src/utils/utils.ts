import { v4 as uuidv4 } from "uuid";
import { URL } from 'url';

export class UtilService {

    validateUrlString(urlString: string): boolean {
        try {
            new URL(urlString); // Try to create a URL object
            return true; // If no error, URL is valid
        } catch (err) {
            return false; // If an error is thrown, URL is invalid
        }
    }

    generateShortCode(): string {
        try {
            return uuidv4().slice(0, 10); // Generate a 10-character short code
        } catch (error) {
            console.error("Error generating short code:", error);
            throw new Error("Failed to generate short code");
        }
    }
}
