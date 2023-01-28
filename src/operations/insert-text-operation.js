import Operation from './operation'
import RemoveTextOperation from "./remove-text-operation";

export class InsertTextOperation extends Operation {
  constructor(spacers, insertIndex) {
    super();
    this._spacers = spacers;
    this._insertIndex = insertIndex;
  }
  apply (editor) {
    editor.getTextModel().insert(this._insertIndex, this._spacers);
  }

  inverse () {
    return new RemoveTextOperation(this._insertIndex, this._insertIndex + this._spacers.length);
  }

  getSapcers () {
    return this._spacers;
  }

  getInsertIndex_ () {
    return this._insertIndex;
  }
}
export default InsertTextOperation