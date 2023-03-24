class TerEditor {
  constructor(el) {
    // 获取目标DOM
    this.$el = typeof el === "string" ? document.querySelector(el) : el;
    this.spacers = "";
    this.startIndex = 0;
    this.endIndex = 0;
    this._initEditor(this.$el);
  }
  _initEditor(el) {
    // 修改 contenteditable
    el.setAttribute("contenteditable", "true");
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
  insertText(e) {
    const text = e.data;
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
    // this.spacers 就应该修改为当前文本内容的开头至光标起点 + 输入内容 + 光标终点至文本内容的结尾
    this.spacers = this.spacers.slice(0, startOffset) + text + this.spacers.slice(endOffset);
    this.$el.innerHTML = this.spacers;
    /**
     * 当文字输入完成时，光标会变成线状，同时光标应该在我们输入内容的末尾处，所以我们需要修改光标位置，
     * 这时 startIndex 应该加上输入内容的长度，而 endIndex 和位置一样。然后我们可以通过 document.createRange
     * 方法来创建一个新的光标位置，setStart 和 setEnd 方法来设置光标的起点和终点，然后先清空当前页面的
     * 光标，再重新设置一个新的光标。
    */
    this.startIndex = startOffset + text.length;
    this.endIndex = this.startIndex;
    const range = document.createRange();
    range.setStart(this.$el.childNodes[0], this.endIndex);
    range.setEnd(this.$el.childNodes[0], this.endIndex);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
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
  // 控制中文输入
  compositionend(e) {
    let text = e.data;
    // compositionend 事件中光标位置已经改变， anchorOffset 和 focusOffset 相同
    const { anchorOffset } = window.getSelection();
    // this.spacers 就应该修改为当前文本内容的开头index减去输入内容的长度 + 输入内容 + 剩余文本内容
    this.spacers = this.spacers.slice(0, anchorOffset - text.length) + text + this.spacers.slice(anchorOffset - text.length);
    this.startIndex = anchorOffset;
    this.endIndex = anchorOffset;
  }
}

export default TerEditor