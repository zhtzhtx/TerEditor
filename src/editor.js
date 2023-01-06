import TextModel from "./models/text-model";
import SelectionModel from "./models/selection-model";
import InsertTextOperation from "./operations/insert-text-operation";
import SetSelectionOperation from "./operations/set-selection-operation";
import RemoveTextOperation from "./operations/remove-text-operation";
import EventHandler from "./event/event-handler";
import BaseView from "./view/base-view";

export class TerEditor {
  constructor(el) {
    this.$root = typeof el === "string" ? document.querySelector(el) : el;
    this.$textModel = new TextModel();
    this.$selectionModel = new SelectionModel();
    this._initEditor();
    this._initView();
  }
  _initEditor() {
    const element = document.createElement("pre");
    element.setAttribute("contenteditable", "true");
    element.setAttribute("spellcheck", "false");
    element.setAttribute("class", "web-editor-pre");
    this.$root.appendChild(element);
    this.$el = element
  }
  _initView() {
    this.$view = new BaseView(this.$textModel, this.$selectionModel, this.$el);
    this.$eventHandler = new EventHandler(this, this.$view);
    this.$eventHandler.addListeners();
  }
  getTextModel() {
    return this.$textModel;
  }

  getSelectionModel() {
    return this.$selectionModel;
  }

  getElement() {
    return this.$el;
  }

  focus() {
    this.$el.focus();
  }

  blur() {
    this.$el.blur();
  }
  /** 所有 operation 执行的入口函数 */
  apply(operation) {
    operation.apply(this);
    this.focus();
  }
  /** 在光标或者选区处插入字符串 */
  insertTextAtCursor(text) {
    if (!text.length) return;
    const selection = this.$selectionModel.getSelection();
    let startIndex = selection.anchor;
    if (!this.$selectionModel.isCollapsed()) {
      this.apply(new RemoveTextOperation(selection.anchor, selection.focus));
      if (this.$selectionModel.isBackward()) {
        startIndex = selection.focus;
      }
    }
    this.apply(new InsertTextOperation(text, startIndex));
    startIndex += text.length;
    this.setSelection(startIndex);
  }

  /** 任意位置插入字符串，光标保持在原位置 */
  insertText(index, text) {
    const selection = this.$selectionModel.getSelection();
    this.apply(new InsertTextOperation(text, index));
    if (selection.anchor <= index) {
      this.setSelection(selection.anchor);
    } else {
      this.setSelection(selection.anchor + text.length);
    }
  }

  /** 设置选区或光标 */
  setSelection(anchor, focus) {
    this.apply(
      new SetSelectionOperation({
        anchor: anchor,
        focus: focus || focus === 0 ? focus : anchor,
      })
    );
  }

  /** 在光标处往回删除一个字符，如果有选中，则删除整个选区 */
  deleteTextAtCursor() {
    let selection = this.$selectionModel.getSelection();
    let startIndex = selection.anchor;
    if (!this.$selectionModel.isCollapsed()) {
      this.apply(new RemoveTextOperation(selection.anchor, selection.focus));
      if (this.$selectionModel.isBackward()) {
        startIndex = selection.focus;
      }
    }else if (selection.anchor > 0) {
      const deleteLen = 1
      const deleteStartIndex = startIndex - deleteLen;
      this.apply(new RemoveTextOperation(deleteStartIndex, startIndex));
      startIndex = deleteStartIndex;
    }

    this.setSelection(startIndex); // 更新选区光标模型
  }
}

export default TerEditor;
