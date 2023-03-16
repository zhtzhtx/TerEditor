import MNode, { NodeType } from "./node";
export class HeadNode extends MNode {
  isContainer = true;
  isBlockContainer = false;
  canContainText = true;
  isParagraph = true;
  level = 1;

  constructor(sourceStart, level) {
    super(sourceStart);
    this.type = NodeType.Head;
    this.level = level;
    this.blockMarkerBefore = "#".repeat(level) + " ";
  }

  // @Override
  continue(currentLine, offset, column) {
    return null;
  }

  // @Override
  canContain(mnode) {
    return false;
  }
}
export default HeadNode;
