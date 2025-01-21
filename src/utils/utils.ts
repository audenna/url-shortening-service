import { v4 as uuidv4 } from "uuid";

export class UtilService {
    generateShortCode(): string {
        try {
            return uuidv4().slice(0, 10); // Generate a 10-character short code
        } catch (error) {
            console.error("Error generating short code:", error);
            throw new Error("Failed to generate short code");
        }
    }
}
