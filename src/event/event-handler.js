import KeyboardEventHandler from './keyboard-event'
export class EventHandler {
  constructor(editor, view) {
    this._keyboardEventHandler = new KeyboardEventHandler(editor, view);
  }
  addListeners () {
    this._keyboardEventHandler.addListeners();
  }
}

export default EventHandler;
