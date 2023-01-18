import BaseEventHandler from "./base-event";
import { EVENT_TYPE } from "../const";

export class ViewEventHandler extends BaseEventHandler {
  isComposing = false;
  addListeners() {
    this._selectionchangeHandler = this._selectionchangeHandler.bind(this);
    const compositionStartHandlerBinder =
      this._compositionStartHandler.bind(this);
    const compositionEndHandlerBinder = this._compositionEndHandler.bind(this);

    this._target.addEventListener(
      "compositionstart",
      compositionStartHandlerBinder
    );
    this._target.addEventListener(
      "compositionend",
      compositionEndHandlerBinder
    );

    this.cacheEventHandler({
      type: "compositionstart",
      listener: compositionStartHandlerBinder,
    });
    this.cacheEventHandler({
      type: "compositionend",
      listener: compositionEndHandlerBinder,
    });
    this._view.on(EVENT_TYPE.SELECTION_CHANGE, this._selectionchangeHandler);
  }
  _selectionchangeHandler(selection) {
    if (this._getComposing()) {
      // 中文输入状态不用更新选区
      return;
    }
    if (selection) {
      this._editor.setSelection(selection.anchor, selection.focus);
    } else {
      this._editor.removeSelection();
    }
  }
  _insertText(e) {
    const text = e.data;
    if (text) {
      this._editor.insertTextAtCursor(text);
    }
  }
  _deleteContentBackward(e) {
    this._editor.deleteTextAtCursor();
  }
  _compositionStartHandler(e) {
    this.isComposing = true;
  }
  _getComposing() {
    return this.isComposing;
  }
  _compositionEndHandler(e) {
    this.isComposing = false;
  }
}

export default ViewEventHandler;
