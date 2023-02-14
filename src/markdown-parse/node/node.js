export class MNode {
  type;
  parent = null;
  firstChild = null;
  lastChild = null;
  prev = null;
  next = null;
  open = true;
  stringContent = "";
  sourceStart;
  sourceEnd;
  blockMarkerBefore = ""; // 标识占位符(叶子块需要,目前只有代码块和标题需要，因为其他叶子快内部可以包含p标签)
  blockMarkerAfter = ""; // 标识占位符(叶子块需要,目前只有代码块和标题需要，因为其他叶子快内部可以包含p标签)
  marker = ""; // 是否是文本标记符占位节点
  isShow = true; // 是否需要显示和隐藏（隐藏的话直接不创建dom节点，占位场景）
  constructor(sourceStart) {
    this.sourceStart = sourceStart;
  }
  unlink() {
    if (this.prev) {
      this.prev.next = this.next;
    } else if (this.parent) {
      this.parent.firstChild = this.next;
    }
    if (this.next) {
      this.next.prev = this.prev;
    } else if (this.parent) {
      this.parent.lastChild = this.prev;
    }
    this.parent = null;
    this.next = null;
    this.prev = null;
  }
  
  appendChild (mnode) {
    mnode.unlink();
    mnode.parent = this;
    if (this.lastChild) {
        this.lastChild.next = mnode;
        mnode.prev = this.lastChild;
        this.lastChild = mnode;
    } else {
        this.firstChild = this.lastChild = mnode;
    }
  }

  prependChild (mnode) {
    mnode.unlink();
    mnode.parent = this;
    if (this.firstChild) {
        this.firstChild.prev = mnode;
        mnode.next = this.firstChild;
        this.firstChild = mnode;
    } else {
        this.firstChild = mnode;
        this.lastChild = mnode;
    }
  }

  insertAfter (mnode) {
    mnode.unlink();
    mnode.next = this.next;
    if (mnode.next) {
      mnode.next.prev = mnode;
    }
    mnode.prev = this;
    this.next = mnode;
    mnode.parent = this.parent;
    if (!mnode.next && mnode.parent) {
      mnode.parent.lastChild = mnode;
    }
  }

  insertBefore (mnode) {
    mnode.unlink();
    mnode.prev = this.prev;
    if (mnode.prev) {
      mnode.prev.next = mnode;
    }
    mnode.next = this;
    this.prev = mnode;
    mnode.parent = this.parent;
    if (!mnode.prev && mnode.parent) {
      mnode.parent.firstChild = mnode;
    }
  }

  setStringContent (stringContent) {
    this.stringContent = stringContent;
  }

  getStringContent () {
    return this.stringContent;
  }
}
