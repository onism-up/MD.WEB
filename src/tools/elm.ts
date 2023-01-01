export const parsingIndex = (event: Event, key: string): number => {
  const target = event.target as HTMLDivElement;
  const index = Number(target.dataset[key]);
  return !isNaN(index) ? index : -1;
};

type onValidationParmer = (res: boolean, value: any) => void;

export type DialogControl = {
  open: Function;
  close: Function;
  validation: Function;
  onValidation: (callback: onValidationParmer) => void;
  callback: onValidationParmer[];
};

export const useDialog = (): DialogControl => {
  return {
    open() {},
    close() {},
    validation() {},
    onValidation(callback) {
      this.callback.push(callback);
    },
    callback: [],
  };
};

//定义一个复制函数
export const copyText = async (text: string) =>
  navigator.clipboard.writeText(text);

export const XSSParsing = (origin: string): string =>
  origin.replace("<", "&lt;").replace(">", "&gt;");

export const isChinese = (temp: string) => {
  var re = /[^\u4e00-\u9fa5]/;
  if (re.test(temp)) return false;
  return true;
};
