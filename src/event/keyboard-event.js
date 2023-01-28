import BaseEventHandler from "./base-event";
import hotkeys from "./hotkeys";

export class KeyboardEventHandler extends BaseEventHandler{
  addListeners() {
    this._target.addEventListener("beforeinput", this._beforeInputHandler.bind(this));
    // 插入输入的中文
    this._target.addEventListener("compositionend", this._insertText.bind(this));
    this._target.addEventListener('keydown', this._keydownHandler.bind(this));
  }
  _beforeInputHandler(e) {
    if (e.inputType === 'insertCompositionText' || e.inputType === 'deleteCompositionText') {
      return;
    }
    e.preventDefault();
    const inputType = "_" + e.inputType;
    if (!this[inputType]) return;
    this[inputType](e);
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
  _keydownHandler (e) {
    if (hotkeys.isRedo(e)) {
      e.preventDefault();
      if (this._editor['redo'] && typeof this._editor['redo'] === 'function') {
        this._editor['redo']();
      }
      return;
    }
    if (hotkeys.isUndo(e)) {
      e.preventDefault();
      if (this._editor['undo'] && typeof this._editor['undo'] === 'function') {
        this._editor['undo']();
      }
      return;
    }
  }
}

export default KeyboardEventHandler;
