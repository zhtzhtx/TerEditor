import debounce from "../utils/debounce";

export class BaseView {
  constructor(textModel, selectionModel, viewContainer) {
    this._textModel = textModel;
    this._selectionModel = selectionModel;
    this._viewContainer = viewContainer;
    this._viewContainer.setAttribute("contenteditable", "true");
    this.addListeners();
  }
  addListeners() {
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
  render () {
    this._viewContainer.innerHTML = this._textModel.getSpacer()
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
}

export default BaseView