import MarkdownParserBlock from "./markdown-parser-block";

class Markdown {
  /** 块解析 */
  _parseBlock (md) {
     new MarkdownParserBlock().parse(md);
     return md
  }
  md2html (md) {
    return this.md2node(md);
  }
  /** markdown 字符串转语法树 */
  md2node(md) {
    return this._parseBlock(md);
  }
}

export default  new Markdown()