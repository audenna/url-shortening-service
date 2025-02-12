export interface IStorageData {
    shortCode: string,
    originalUrl: string
}

export interface ISocketResponse {
    shortenedURL: string
}

export interface IStorageConfig {
    type: string;
}

export interface IUrlPayload {
    originalUrl: string,
    customName?: string
}
