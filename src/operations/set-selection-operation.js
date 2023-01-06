import Operation from './operation'

export class SetSelectionOperation extends Operation {
  constructor(selection) {
    super();
    this._selection = selection;
  }
  apply(editor) {
    this.setOldSelection(editor.getSelectionModel().getSelection());
    editor.getSelectionModel().setSelection(this._selection);
  }

  inverse() {
    return new SetSelectionOperation(this._oldSelection);
  }

  getSelection() {
    return this._selection;
  }

  getOldSelection() {
    return this._oldSelection;
  }

  setOldSelection(oldSelection) {
    this._oldSelection = oldSelection;
  }
}
export default SetSelectionOperation
