import TextModel from "./models/text-model";
import SelectionModel from "./models/selection-model";
import InsertTextOperation from './operations/insert-text-operation'
import BaseView  from "./view/base-view";

export class TerEditor {
  constructor(el) {
    this.$el = typeof el === "string" ? document.querySelector(el) : el;
    this.$textModel = new TextModel();
    this.$selectionModel = new SelectionModel()
    this._initEditor();
  }
  _initEditor() {
    const element = document.createElement("pre");
    element.setAttribute("contenteditable", "true");
    element.setAttribute("spellcheck", "false");
    this.$el.appendChild(element);
    this.$editorElement = element;
  }
  _initView () {
    this._view = new BaseView( this.$textModel, this.$selectionModel, this.$el);
    this.eventHandler_ = new EventHandler(this, this.view_);
    this.eventHandler_.addListeners();
    this._view.render();
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
}

export default TerEditor