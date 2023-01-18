import BaseEventHandler from "./base-event";

export class KeyboardEventHandler extends BaseEventHandler{
  addListeners() {
    this._target.addEventListener("beforeinput", this._beforeInputHandler.bind(this));
    // 插入输入的中文
    this._target.addEventListener("compositionend", this._insertText.bind(this));
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
}

export default KeyboardEventHandler;
