export class UrlStorage {
    private storage: Map<string, string>;

    constructor() {
        this.storage = new Map<string, string>();
    }

    saveMapping(shortCode: string, originalUrl: string): void {
        try {
            this.storage.set(shortCode, originalUrl);
        } catch (error) {
            console.error("Error saving mapping:", error);
            throw new Error("Failed to save mapping");
        }
    }

    getOriginalUrl(shortCode: string): string | undefined {
        try {
            return this.storage.get(shortCode);
        } catch (error) {
            console.error("Error fetching original URL:", error);
            throw new Error("Failed to fetch original URL");
        }
    }
}
