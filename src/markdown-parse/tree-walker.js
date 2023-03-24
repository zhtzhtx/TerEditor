export class MTreeWalker {
  _root;
  _current;
  _close;

  constructor (mnode) {
    this._root = mnode;
    this._current = mnode;
    this._close = false;
  }

  /** 获取下一个节点 */
  next () {
    let mnode = this._current;
    let close = this._close;

    if (mnode === null) {
        return null;
    }

    if (!close && mnode.isContainer) {
        if (mnode.firstChild) {
            this._current = mnode.firstChild;
            this._close = false;
        } else {
            this._close = true;
        }
    } else if (mnode === this._root) {
        this._current = null;
    } else if (mnode.next === null) {
        this._current = mnode.parent;
        this._close = true;
    } else {
        this._current = mnode.next;
        this._close = false;
    }

    return { mnode, close };
  }
}
export default MTreeWalker;