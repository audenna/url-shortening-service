import { IStorageData } from "../types";

export interface IDataRepository {
    save(data: IStorageData): Promise<void>;

    findById(id: string): Promise<string | null>;
}
