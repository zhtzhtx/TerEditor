class TerEditor {
  constructor(el) {
    this.$el = typeof el === "string" ? document.querySelector(el) : el;
    this.spacers = "";
    this.startIndex = 0;
    this.endIndex = 0;
    this.isOnComposition = false;
    this._initEditor(this.$el);
  }
  _initEditor(el) {
    // 监听输入英文
    el.addEventListener("beforeinput", (e) => {
      const inputType = e.inputType;
      e.preventDefault();
      if (!this[inputType]) return;
      this[inputType](e);
    });
    // 监听输入中文
    el.addEventListener("compositionend", (e) => {
      this["compositionend"](e);
    });
  }
  // 单字输入
  insertText(e) {
    let text = e.data;
    if (parseInt(text) === 9) {
      text = "九";
    }
    const { anchorOffset, focusOffset } = window.getSelection();
    let startOffset, endOffset;
    // 获取选中范围,如果光标没有选中则保持当前位置
    if (focusOffset !== anchorOffset) {
      startOffset = Math.min(focusOffset, anchorOffset);
      endOffset = Math.max(focusOffset, anchorOffset);
    } else {
      startOffset = anchorOffset;
      endOffset = anchorOffset;
    }
    this.spacers =
      this.spacers.slice(0, startOffset) + text + this.spacers.slice(endOffset);
    this.$el.innerHTML = this.spacers;
    this.startIndex = startOffset + text.length;
    this.endIndex = this.startIndex;
    // const range = document.createRange();
    // range.setStart(this.$el.childNodes[0], this.endIndex);
    // range.setEnd(this.$el.childNodes[0], this.endIndex);
    // window.getSelection().removeAllRanges();
    // window.getSelection().addRange(range);
  }
  compositionend(e) {
    let text = e.data;
    const { anchorOffset, focusOffset } = window.getSelection();
    this.spacers =
      this.spacers.slice(0, anchorOffset - text.length) +
      text +
      this.spacers.slice(anchorOffset - text.length);
      console.log(this.spacers)
  }
  // 删除
  deleteContentBackward(e) {
    const { anchorOffset, focusOffset } = window.getSelection();
    let startOffset, endOffset;
    // 如果没有数据则保持光标不动
    if (anchorOffset === 0 && focusOffset === 0) {
      this.startIndex = 0;
      this.endIndex = 0;
    } else {
      // 获取选中范围,如果光标没有选中范围则向前去除一个
      if (focusOffset !== anchorOffset) {
        startOffset = Math.min(focusOffset, anchorOffset);
        endOffset = Math.max(focusOffset, anchorOffset);
      } else {
        startOffset = anchorOffset - 1;
        endOffset = anchorOffset;
      }
      this.spacers =
        this.spacers.slice(0, startOffset) + this.spacers.slice(endOffset);
      this.$el.innerHTML = this.spacers;
      this.startIndex = startOffset;
      this.endIndex = startOffset;
      const range = document.createRange();
      range.setStart(this.$el.childNodes[0], this.endIndex);
      range.setEnd(this.$el.childNodes[0], this.endIndex);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
    }
  }
}
