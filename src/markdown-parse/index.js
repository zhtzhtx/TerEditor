import MarkdownParserBlock from "./markdown-parser-block";
import MarkdownParserLine from "./markdown-parser-line";
import MarkdownRender from "./markdown-render";
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
    return new MarkdownRender().render(this.md2node(md));
  }
  /** markdown 字符串转语法树 */
  md2node(md) {
    const html = this._parseLine(this._parseBlock(md));
    return html
  }
}

export default  new Markdown()