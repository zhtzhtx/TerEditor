import { debounce } from "../utils/debounce";
import { EVENT_TYPE } from '../const'

export class TextModel {
  constructor(spacers) {
    this._spacers = spacers || "";
    this._events = {};
    this._textChangeEmit = debounce(() => {
      this.emit(EVENT_TYPE.TEXT_CHANGE);
    });
  }

  getSpacer() {
    return this._spacers;
  }

  getLength() {
    return this._spacers.length;
  }

  insert(spacerIndex, spacers) {
    const originalSpacers = this._spacers;
    this._spacers =
      originalSpacers.slice(0, spacerIndex) +
      spacers +
      originalSpacers.slice(spacerIndex);
    this._textChangeEmit();
  }
  remove(startIndex, endIndex) {
    const originalSpacers = this._spacers;
    if (startIndex > endIndex) {
      [ startIndex, endIndex ] = [ endIndex, startIndex];
    }
    this._spacers = originalSpacers.slice(0, startIndex) + originalSpacers.slice(endIndex);
    this._textChangeEmit();
    return originalSpacers.slice(startIndex, endIndex);
  }
  // TODO: 发布订阅，先手写，后面会改
  on(event, fn) {
    if (!this._events[event]) {
      this._events[event] = [];
    }
    this._events[event].push(fn);
  }
  emit(event) {
    this._events[event].forEach((fn) => {
      fn(this._spacers);
    });
  }
}

export default TextModel;
