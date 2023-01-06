import Operation from './operation'

export class RemoveTextOperation extends Operation {
  constructor(startIndex, endIndex) {
    super();
    this._startIndex = startIndex;
    this._endIndex = endIndex;
  }

  apply(editor) {
    this._removeText = editor
      .getTextModel()
      .remove(this._startIndex, this._endIndex);
  }

  inverse() {
    return new InsertTextOperation(this.removeText_, this._startIndex);
  }

  getStartIndex() {
    return this._startIndex;
  }

  getEndIndex() {
    return this._endIndex;
  }
}

export default RemoveTextOperation