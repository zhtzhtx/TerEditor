import TextModel from "../models/text-model";
import { debounce } from "../utils/debounce";

export class BaseView {
  constructor(textModel, selectionModel, viewContainer) {
    this._textModel = textModel;
    this._selectionModel = selectionModel;
    this._viewContainer = viewContainer;
    this._viewContainer.setAttribute("contenteditable", "true");
    this.addListeners();
  }
  addListeners() {
    // 模型事件
    this._renderBinder = this.render.bind(this);
    // 模型事件触发已经节流，此处不需节流
    this._textModel.on(TextModel.EVENT_TYPE.TEXT_CHANGE, this._renderBinder);
    // dom 选区事件
    this._domSelectionChangeHandlerBinder = debounce(
      this.domSelectionChangeHandler.bind(this),
      100
    );
    window.document.addEventListener(
      "selectionchange",
      this._domSelectionChangeHandlerBinder
    );
  }
  render() {
    this._viewContainer.innerHTML = this._textModel.getSpacer();
    this.updateDomSelection()
  }
  /** 鼠标或键盘导致的原生 dom 选区变化，同步到选区模型 */
  domSelectionChangeHandler(e) {
    const { anchorOffset, focusOffset } = window.getSelection();
    let anchor, focus;
    // 获取选中范围,如果光标没有选中则保持当前位置
    if (focusOffset !== anchorOffset) {
      anchor = Math.min(focusOffset, anchorOffset);
      focus = Math.max(focusOffset, anchorOffset);
    } else {
      anchor = anchorOffset;
      focus = anchorOffset;
    }
    this._selectionModel.setSelection({ anchor, focus });
  }
  /** 更新 dom 真实选区 */
  updateDomSelection() {
    const domSelection = window.getSelection();
    if (domSelection) {
      const selectionFromModel = this._selectionModel.getSelection();
      domSelection.removeAllRanges();
      const range = this.customSelToDomSel(selectionFromModel);
      if (range) {
        domSelection.addRange(range);
      }
    }
  }
  /** 将选区模型转换成 Dom 的真实选区 */
  customSelToDomSel(customSelection) {
    let range = null;
    if (customSelection) {
      const rangeStart = this.customPointToDomPoint(customSelection.anchor);
      const rangeEnd =
        customSelection.anchor === customSelection.focus
          ? rangeStart
          : this.customPointToDomPoint(customSelection.focus);
      if (rangeStart && rangeEnd) {
        range = window.document.createRange();
        range.setStart(rangeStart.domNode, rangeStart.domOffset);
        range.setEnd(rangeEnd.domNode, rangeEnd.domOffset);
      }
    }
    return range;
  }
  customPointToDomPoint(customPoint) {
    return {
      domNode: this._viewContainer.childNodes[0],
      domOffset: customPoint,
    };
  }
}

export default BaseView;
