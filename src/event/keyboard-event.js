import BaseEventHandler from "./base-event";
import hotkeys from "./hotkeys";

export class KeyboardEventHandler extends BaseEventHandler {
  addListeners() {
    this._target.addEventListener(
      "beforeinput",
      this._beforeInputHandler.bind(this)
    );
    this._target.addEventListener("keydown", this._keydownHandler.bind(this));
  }
  _beforeInputHandler(e) {
    if (
      e.inputType === "insertCompositionText" ||
      e.inputType === "deleteCompositionText"
    ) {
      return;
    }
    e.preventDefault();
    const inputType = e.inputType;
    switch (inputType) {
      case "deleteContentBackward": // 删除光标前面
        this._editor.deleteTextAtCursor();
        break;
      case "insertParagraph": // 回车
        this._editor.insertTextAtCursor("\n");
        break;
      case "insertText":
        const text = e.data;
        if (text) {
          this._editor.insertTextAtCursor(text);
        }
        break;
      case "insertFromPaste":
        const data = e.dataTransfer;
        text = data.getData("text/plain");
        if (text) {
          this.editor.insertTextAtCursor(text);
        }
        break;
    }
  }
  _keydownHandler(e) {
    if (hotkeys.isRedo(e)) {
      e.preventDefault();
      if (this._editor["redo"] && typeof this._editor["redo"] === "function") {
        this._editor["redo"]();
      }
      return;
    }
    if (hotkeys.isUndo(e)) {
      e.preventDefault();
      if (this._editor["undo"] && typeof this._editor["undo"] === "function") {
        this._editor["undo"]();
      }
      return;
    }
  }
}

export default KeyboardEventHandler;
