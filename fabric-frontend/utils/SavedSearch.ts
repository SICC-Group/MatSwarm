import { LocalStorageItem } from './LocalStorageItem';
import { GenerateUniqueID } from './GenerateUniqueID';

export interface SavedSearchItem {
    value: string;
    id: number;
}

export type OnChangeListener = () => void;
const gListeners = new Set<OnChangeListener>();

window.addEventListener('storage', (e) => {
    if (e.storageArea === localStorage && e.key === 'search_bridge') {
        console.log('trigger bridge');
        gListeners.forEach(listener => listener());
    }
})

export function SaveSearchResult(queryID: number, value: string) {
    const obj = new LocalStorageItem<SavedSearchItem[]>('saved_search', []);
    let saved = false;
    for (let i = 0; i < obj.value.length; ++i) {
        if (obj.value[i].id === queryID) {
            saved = true;
            break;
        }
    }

    if (saved) {
        return;
    }
    obj.value = [...obj.value, { id: queryID, value}];
    gListeners.forEach(listener => listener());
    localStorage.setItem('search_bridge', `${GenerateUniqueID()}`);
}

export function RemoveSearchResult(queryID: number) {
    const obj = new LocalStorageItem<SavedSearchItem[]>('saved_search', []);
    const newObj: typeof obj.value = [];

    for (let i of obj.value) {
        if (i.id !== queryID) newObj.push(i);
    }
    obj.value = newObj;
    gListeners.forEach(listener => listener());
    localStorage.setItem('search_bridge', `${GenerateUniqueID()}`);
}

export function GetAllSavedResult() {
    return new LocalStorageItem<SavedSearchItem[]>('saved_search', []).value;
}



export function AddOnChangeListener(listener: () => void) {
    gListeners.add(listener);
}

export function RemoveOnChangeListener(listener: () => void) {
    gListeners.delete(listener);
}