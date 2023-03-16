import MNode, { NodeType } from "./node";
export class ParagraphNode extends MNode {
  
   isContainer = true;
   isBlockContainer = false;
   canContainText = true;
   isParagraph = true;
  

  constructor (sourceStart) {
    super(sourceStart);
    this.type = NodeType.Paragraph;
  }

  // @Override
  continue (currentLine, offset, column) { 
    return null;
  }
  
  // @Override
  finalize(sourceEnd) {
    super.finalize(sourceEnd);
    // TODO 引用链接 map 解析
  }
  
  // @Override
  canContain(mnode) {
    return false;
  }
}
export default ParagraphNode;