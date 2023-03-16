import { debounce } from "../utils/debounce";
import markdown from "../markdown-parse"
import { EVENT_TYPE } from "../const";

export class BaseView {
  constructor(textModel, selectionModel, viewContainer) {
    this._textModel = textModel;
    this._selectionModel = selectionModel;
    this._viewContainer = viewContainer;
    this._viewContainer.setAttribute("contenteditable", "true");
    this._events = {};
    this.addListeners();
  }
  addListeners() {
    // 模型事件
    this._renderBinder = this.render.bind(this);
    // 模型事件触发已经节流，此处不需节流
    this._textModel.on(EVENT_TYPE.TEXT_CHANGE, this._renderBinder);
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
    this._viewContainer.innerHTML = markdown.md2html(this._textModel.getSpacer());
    this.updateDomSelection();
  }
  /** 鼠标或键盘导致的原生 dom 选区变化，同步到选区模型 */
  domSelectionChangeHandler(e) {
    const domSelection = window.getSelection();
    let selection = null;
    if (domSelection) {
      selection = this.domSelToCustomSel(domSelection);
    }
    // this.showMarker(domSelection);
    this.emit(EVENT_TYPE.SELECTION_CHANGE, selection);
  }
  /** 将 Dom 真实选区转换成选区模型 */
  domSelToCustomSel(domSelection) {
    // let selection = { anchor: 0, focus: 0 };
    // if (domSelection.anchorNode) {
    //   const anchorIndex = this.domPointToCustomPoint({
    //     domNode: domSelection.anchorNode,
    //     domOffset: domSelection.anchorOffset,
    //   });
    //   const focusIndex = domSelection.isCollapsed
    //     ? anchorIndex
    //     : this.domPointToCustomPoint({
    //         domNode: domSelection.focusNode,
    //         domOffset: domSelection.focusOffset,
    //       });
    //   selection = { anchor: anchorIndex, focus: focusIndex };
    // }
    const { anchorOffset, focusOffset } = domSelection;
    let anchor, focus;
    // 获取选中范围,如果光标没有选中则保持当前位置
    if (focusOffset !== anchorOffset) {
      anchor = Math.min(focusOffset, anchorOffset);
      focus = Math.max(focusOffset, anchorOffset);
    } else {
      anchor = anchorOffset;
      focus = anchorOffset;
    }
    return {anchor, focus};
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
        // 立即调用showmarker，避免在marker之间输入时，marker触发延时导致闪烁的问题
        // this.showMarker(domSelection);
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
      domNode: this._viewContainer.childNodes[0] || this._viewContainer,
      domOffset: customPoint,
    };
  }
  // TODO: 发布订阅，先手写，后面会改
  on(event, fn) {
    if (!this._events[event]) {
      this._events[event] = [];
    }
    this._events[event].push(fn);
  }
  emit(event, data) {
    this._events[event].forEach((fn) => {
      fn(data);
    });
  }
}

export default BaseView;
