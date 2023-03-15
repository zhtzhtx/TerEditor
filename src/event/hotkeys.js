import { IS_KEYS } from "../const";

class Hotkeys {
  static getInstance() {
    if (!this.instance) {
      this.instance = new Hotkeys();
    }
    return this.instance;
  }

  isTab (e) {
    return IS_KEYS['isTab'](e);
  }

  isRedo(e) {
    return IS_KEYS["redo"](e);
  }

  isUndo(e) {
    return IS_KEYS["undo"](e);
  }
}

export default Hotkeys.getInstance();
