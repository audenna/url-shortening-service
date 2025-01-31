import { IStorageData } from "../services/DataService";

export interface IDataRepository {
    save(data: IStorageData): Promise<void>;
    find(id: string): Promise<any>;
    findAll(): Promise<any[]>;
}
