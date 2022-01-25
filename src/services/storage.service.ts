import { injectable } from "inversify";

@injectable()
export class StorageService {

    /**
     * Store a given object.
     * 
     * @method store()
     * @param key The key to store the value with.
     * @param objectToStore The object to store.
     */
    public store<T>(key: string, objectToStore: T): void {

        const valueToStore = JSON.stringify(objectToStore);
        localStorage.setItem(key, valueToStore);
    }

    /**
     * Get a value from storage.
     * 
     * @method get()
     * @param key The key to retrieve from storage.
     * @returns The requested value as typed, or null if no value was found.
     */
    public get<T>(key: string): T | null {

        // Try to get the value from the store.
        // If no value was found, return null.
        const valueFromStore = localStorage.getItem(key);
        if(!valueFromStore) {
            return null;
        }

        // Return value from store as expected type.
        return JSON.parse(valueFromStore) as T;
    }
}