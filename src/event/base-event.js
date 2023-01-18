export class BaseEventHandler {
  _eventList = [];
  constructor(editor, view) {
    this._editor = editor;
    this._target = editor.getElement();
    this._view = view;
  }
  
  addListeners() {}

  cacheEventHandler(eventItem) {
    this._eventList.push(eventItem);
  }
}

export default BaseEventHandler;
