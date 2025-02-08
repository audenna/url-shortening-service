import { IStorageData } from "../types";

export interface IDataRepository {
    save(data: IStorageData): Promise<void>;

    findById(id: string): Promise<IStorageData | null>;

    fetchAllRecords(): Promise<IStorageData[]>;
}
