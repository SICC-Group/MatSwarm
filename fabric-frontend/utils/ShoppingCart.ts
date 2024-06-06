import { LocalStorageItem } from './LocalStorageItem';
import { GetTemplateNames } from '../apis/template/GetTemplateNames';

function NumberOfFielsExcludeGiven(obj: any, key: any): number {
  let count = 0;
  for (const i in obj) {
    if (i !== String(key)){
      count += 1;
    }
  }
  return count;
}

/**
 * 显然全局只需要一个Cart对象所以它是singleton
 * Cart管理localStorage中的值，在这些值改变时调用对应的listener
 * 还需要监听storage的change事件
 */
export class Cart {
  
  private static instance: Cart;

  public static get Instance() {
    return this.instance || (this.instance = new this());
  }

  private addDataListeners: 
    Set<(dataID: number, dataTitle: string, templateID: number, addTemplate: boolean) => void>;
  private removeDataListeners: Set<(dataID: number, templateID: number) => void>;
  private removeTemplateListeners: Set<(tempalteID: number) => void>;

  private localStorageItem: LocalStorageItem;

  private constructor() {
    this.addDataListeners = new Set();
    this.removeDataListeners = new Set();
    this.removeTemplateListeners = new Set();

    this.localStorageItem = new LocalStorageItem('cart');
    interface IBridgeData {
      type: string;
      tid?: number;
      id?: number;
      title?: string;
    }

    window.addEventListener('storage', (e) => {
      if (e.storageArea === localStorage && e.key === 'bridge'){
        const bridge = JSON.parse(e.newValue) as IBridgeData;
        const obj = this.localStorageItem.value;
        if (bridge.type === 'addId') {
          // call listeners
          const count = NumberOfFielsExcludeGiven(obj[bridge.tid], bridge.id);
          const templateID = Number(bridge.tid);
          const dataID = Number(bridge.id);
          const dataTitle = String(bridge.title);
          for (const i of this.addDataListeners){ i(dataID, dataTitle, templateID, (count === 0)); }
        }
        else if (bridge.type === 'removeId') {
          const templateID = Number(bridge.tid);
          const dataID = Number(bridge.id);
          for (const i of this.removeDataListeners){ i(dataID, templateID); }
        }
        else if (bridge.type === 'removeTemplate') {
          const templateID = Number(bridge.tid);
          for (const i of this.removeTemplateListeners){ i(templateID); }
        }
      }
   });
  }
  
  public AddData(dataID: number, dataTitle: string, templateID: number, triggerBridge = true): void {
    // add
    console.log(`add: ${dataID}, title: ${dataTitle}`)
    const obj = this.localStorageItem.value || {};
    let newTemplate = false;
    if (!obj.hasOwnProperty(templateID)) {
      newTemplate = true;
      obj[templateID] = {};
    }
    GetTemplateNames(templateID);
    obj[templateID][dataID] = dataTitle;
    this.localStorageItem.value = obj;
    // call listeners
    for (const i of this.addDataListeners){ i(dataID, dataTitle, templateID, newTemplate); }
    // bridge
    if (triggerBridge){
      localStorage.setItem('bridge', JSON.stringify({
        type: 'addId', 
        tid: templateID,
        id: dataID,
        title: dataTitle,
      }));
    }
  }

  public RemoveData(dataID: number, templateID: number, triggerBridge = true): void {
    // remove
    const obj = this.localStorageItem.value;
    if (!obj.hasOwnProperty(templateID) || !obj[templateID].hasOwnProperty(dataID)) {
      return;
    }
    const count = NumberOfFielsExcludeGiven(obj[templateID], dataID);
    if (count === 0) {
      this.RemoveTemplate(templateID);
      return;
    }
    delete obj[templateID][dataID];
    this.localStorageItem.value = obj;
    // listeners
    for (const i of this.removeDataListeners){ i(dataID, templateID); }
    // bridge
    if (triggerBridge) {
      localStorage.setItem('bridge', JSON.stringify({type: 'removeId', tid: templateID, id: dataID}));
    }
  }
  
  public RemoveTemplate(templateID: number, triggerBridge = true): void {
    // remove
    const obj = this.localStorageItem.value;
    if (!obj.hasOwnProperty(templateID)) {
      return;
    }
    delete obj[templateID];
    this.localStorageItem.value = obj;
    // listeners
    for (const i of this.removeTemplateListeners){ i(templateID); }
    // bridge
    localStorage.setItem('bridge', JSON.stringify({type: 'removeTemplate', tid: templateID}));
  }

  public HasData(dataID: number): boolean {
    const ids = this.GetDataList();
    return ids.indexOf(dataID) !== -1;
  }

  public AddOnAddDataListener(
    listener: (dataID: number, dataTitle: string, templateID: number, addTemplate: boolean ) => void): void {
    this.addDataListeners.add(listener);
  }

  public AddOnRemoveDataListener(listener: (dataID: number, tempalteID: number) => void): void {
    this.removeDataListeners.add(listener);
  }

  public AddOnRemoveTempalteListener(listener: (templateID: number) => void): void {
    this.removeTemplateListeners.add(listener);
  }

  public RemoveOnAddDataListener(
    listener: (dataID: number, dataTitle: string, templateID: number, addTemplate: boolean ) => void): void {
    this.addDataListeners.delete(listener);
  }

  public RemoveOnRemoveDataListener(listener: (dataID: number, tempalteID: number) => void): void {
    this.removeDataListeners.delete(listener);
  }

  public RemoveOnRemoveTempalteListener(listener: (templateID: number) => void): void {
    this.removeTemplateListeners.delete(listener);
  }

  public GetTemplateList(): number[] {
    const ret: number[] = [];
    const obj = this.localStorageItem.value;
    if (obj == null) {
      return [];
    }
    for (const i in obj) {
      if (obj.hasOwnProperty(i)) {
        ret.push(Number(i));
      }
    }
    return ret;
  }

  // 如果不给出tid则获取全部的id
  public GetDataList(templateID?: number): number[] {
    const obj = this.localStorageItem.value;
    if (obj == null) {
      return;
    }
    const ret: number[] = [];
    if (templateID != null) {
      if (!obj.hasOwnProperty(templateID)){
        return;
      }
      for (const i in obj[templateID]) {
        if (obj[templateID].hasOwnProperty(i)) {
          ret.push(Number(i));
        }
      }
    }
    else {
      for (const tid in obj) {
        if (obj.hasOwnProperty(tid)) {
          for (const did in obj[tid]) {
            if (obj[tid].hasOwnProperty(did)) {
              ret.push(Number(did));
            }
          }
        }
      }
    }
    return ret;
  }

  public GetDataTitle(dataID: number, templateID: number): string {
    const obj = this.localStorageItem.value;
    if (!obj.hasOwnProperty(templateID) || !obj[templateID].hasOwnProperty(dataID)) {
      return;
    }
    return obj[templateID][dataID];
  }
}
