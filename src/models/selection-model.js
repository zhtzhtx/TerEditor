import { debounce } from "../utils/debounce";

export class SelectionModel {
  static EVENT_TYPE = {
    SELECTION_CHANGE: 'selection-change'
  }

  constructor() {
    this._selection = { anchor: 0, focus: 0 };
  }
  /** 判断两个选区模型是否是同一块区域 */
  static isEqual (selection1, selection2) {
    return selection1.anchor === selection2.anchor && selection1.focus === selection2.focus;
  }

  getSelection () {
    return { ...this._selection };
  }

  setSelection (selection) {
    if (selection && this._selection && selection.anchor === this._selection.anchor && selection.focus === this._selection.focus) {
      return;
    }
    this._selection = selection ? { ...selection } : { anchor: 0, focus: 0 };
  }

  isCollapsed () {
    return this._selection && this._selection.anchor === this._selection.focus;
  }

  isBackward () {
    return this._selection && this._selection.anchor > this._selection.focus;
  }

}

export default SelectionModel