export class InsertTextOperation extends Operation {
  constructor(spacers, insertIndex) {
    super();
    this._spacers = spacers;
    this._insertIndex = insertIndex;
  }
  apply (editor) {
    editor.getTextModel().insert(this._insertIndex, this._spacers);
  }

  inverse () {}

  getSapcers () {
    return this._spacers;
  }

  getInsertIndex_ () {
    return this._insertIndex;
  }
}
