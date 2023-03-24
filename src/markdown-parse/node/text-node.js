import MNode, { NodeType } from "./node";
export class TextNode extends MNode {

  isContainer = false;
  isBlockContainer = false;
  canContainText = true;
  isParagraph = false;
  text;

  constructor (sourceStart, text) {
    super(sourceStart);
    this.type = NodeType.Text;
    this.text = text;
    this.sourceEnd = sourceStart + text.length;
  }

}
export default TextNode;