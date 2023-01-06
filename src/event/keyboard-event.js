export class KeyboardEventHandler {
  constructor(editor, view) {
    this._editor = editor;
    this._view = view;
  }
  addListeners() {
    this._editor.$el.addEventListener("beforeinput", this._beforeInputHandler.bind(this));
  }
  _beforeInputHandler(e) {
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
