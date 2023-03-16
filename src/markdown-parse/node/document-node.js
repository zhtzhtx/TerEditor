import MNode, { NodeType } from "./node";
export class DocumentNode extends MNode {
  isContainer = true;
  isBlockContainer = false;
  canContainText = false;
  isParagraph = true;

  constructor (sourceStart) {
    super(sourceStart);
    this.type = NodeType.Document;
  }

  continue (currentLine, offset, column) { 
    return { offset: -1, column: -1, spaceInTab: -1 };
  }

  canContain(mnode) {
    return mnode.type !== NodeType.Item;
  }
}
export default DocumentNode;