import MarkdownParserBlock from "./markdown-parser-block";
import MTreeWalker from "./tree-walker";

class Markdown {
  /** 块解析 */
  _parseBlock (md) {
     return new MarkdownParserBlock().parse(md);
  }
  _parseLine (block) {
    const walker = new MTreeWalker(block);
    let current;
    while (current = walker.next()) {
      if (!current.close && current.mnode.canContainText) {
        new MarkdownParserLine().parse(current.mnode);
      }
    }
    return block;
  }
  md2html (md) {
    return this.md2node(md);
  }
  /** markdown 字符串转语法树 */
  md2node(md) {
    // this._parseBlock(md)
    console.log(this._parseBlock(md))
    // return this._parseLine(this._parseBlock(md));
  }
}

export default  new Markdown()