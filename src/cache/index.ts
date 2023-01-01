import { cloneDeep } from "lodash";
class CaCheSystem<T extends object> {
  private syskey: string;
  sysData: T;
  initData: T;
  constructor(syskey: string, defultValue: T) {
    this.syskey = syskey;
    this.initData = cloneDeep(defultValue);
    this.sysData = defultValue;
    this.loadKey();
  }
  private loadKey() {
    const localData = localStorage.getItem(this.syskey);
    if (localData) {
      const localDataPure = JSON.parse(localData);
      if (localDataPure || typeof localDataPure === "object") {
        Object.assign(this.sysData, localDataPure);
      }
    }
  }
  private reload(value: T) {
    localStorage.setItem(this.syskey, JSON.stringify(value));
  }
  setItem<K extends keyof T>(key: K, value: T[K]) {
    this.sysData[key] = value;
    this.reload(this.sysData);
  }
  getItem<K extends keyof T>(key: K): T[K] {
    return this.sysData[key];
  }
  initItem<K extends keyof T>(key: K) {
    this.sysData[key] = this.initData[key];
  }
  reSetSystem() {
    this.sysData = cloneDeep(this.initData);
    this.reload(this.sysData);
  }
}

type DefultValueType = {
  sidebarWidth: number;
  token: string;
  checkMDId: string;
  theme: string;
  first: boolean;
};

const defultValue: DefultValueType = {
  sidebarWidth: 260,
  checkMDId: "",
  token: "",
  theme: "light",
  first: true,
};

export default new CaCheSystem("mdsys", defultValue);
