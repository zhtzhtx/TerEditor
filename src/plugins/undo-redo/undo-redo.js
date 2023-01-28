import { SetSelectionOperation, InsertTextOperation } from "../../operations";
import { debounce } from "../../utils/debounce";

export const withUndoRedo = (editor) => {
  const undoRedoEditor = editor;
  const apply = editor.apply.bind(editor);

  undoRedoEditor.history = { undos: [], redos: [] };
  undoRedoEditor.operations = [];

  undoRedoEditor.redo = () => {
    const { history } = undoRedoEditor;
    const { redos } = history;
    if (redos.length > 0) {
      const batch = redos.pop();
      for (let op of batch) {
        apply(op);
      }
      history.undos.push(batch);
    }
  };

  undoRedoEditor.undo = () => {
    const { history } = undoRedoEditor;
    const { undos } = history;
    if (undos.length > 0) {
      const batch = undos.pop();
      const inverseOps = batch
        .map((op) => {
          return op.inverse();
        })
        .reverse();
      for (const op of inverseOps) {
        apply(op);
      }
      history.redos.push(batch);
    }
  };

  undoRedoEditor.apply = (op) => {
    const { operations, history } = undoRedoEditor;
    apply(op);
    operations.push(op);
    addHistory(operations, history);
  };

  return undoRedoEditor;
};

const shouldClear = (op) => {
  return op instanceof InsertTextOperation;
};

const addHistory = debounce((operations, history) => {
  const { undos } = history;
  let lastBatch = undos[undos.length - 1];
  let lastBatchOp = lastBatch && lastBatch[lastBatch.length - 1];
  let sameBatch = false;
  for (let op of operations) {
    let overwrite = false;
    // 将连续的选区变动合并，减少消耗,同时这里涉及到撤销时光标跟随的逻辑
    if (
      op instanceof SetSelectionOperation &&
      lastBatchOp &&
      lastBatchOp instanceof SetSelectionOperation
    ) {
      op = SetSelectionOperation.merge(lastBatchOp, op);
      overwrite = true;
    }
    if (sameBatch || overwrite) {
      if (overwrite) {
        lastBatch.pop();
      }
      lastBatch.push(op);
    } else {
      lastBatch = [op];
      undos.push(lastBatch);
      sameBatch = true; // 超过节流时间强制合并
    }
    lastBatchOp = op;
    if (shouldClear(op)) {
      history.redos = [];
    }
  }
  while (undos.length > 100) {
    undos.shift();
  }
  operations.length = 0;
}, 300);
