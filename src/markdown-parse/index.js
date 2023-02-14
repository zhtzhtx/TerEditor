class Markdown {
  /** 块解析 */
  _parseBlock (md) {
    return md;
  }
  /** markdown 字符串转语法树 */
  md2node(md) {
    return this._parseBlock(md);
  }
}

export default Markdown