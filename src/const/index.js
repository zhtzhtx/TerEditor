import { isKeyHotkey } from 'is-hotkey'
import { IS_APPLE } from '../utils/browser'

// 操作类型
export const EVENT_TYPE = {
  SELECTION_CHANGE: "selection-change",
  TEXT_CHANGE: "text-change"
};

// 键盘操作
export const IS_KEYS = {
  moveBackward: isKeyHotkey('left'),
  moveForward: isKeyHotkey('right'),
  deleteBackward: isKeyHotkey('shift?+backspace'),
  deleteForward: isKeyHotkey('shift?+delete'),
  isTab: isKeyHotkey('tab'),
  undo: isKeyHotkey('mod+z'),
  redo: IS_APPLE ? isKeyHotkey('cmd+shift+z') : isKeyHotkey('ctrl+y'),
  changeMode: isKeyHotkey('mod+/'),
};