import KeyboardEventHandler from './keyboard-event'
import ViewEventHandler from "./view-event";

export class EventHandler {
  constructor(editor, view) {
    this._keyboardEventHandler = new KeyboardEventHandler(editor, view);
    this._viewEventHandler = new ViewEventHandler(editor, view);
  }
  addListeners () {
    this._keyboardEventHandler.addListeners();
    this._viewEventHandler.addListeners();
  }
}

export default EventHandler;
