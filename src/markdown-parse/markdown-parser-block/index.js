class MarkdownParserBlock {
  _doc; // 语法树,也是根节点
  _sourceIndex; // 整个字符串的当前位置,用于源码映射
  _offset; // 当前行当前处理的字符位置
  _column; // 缩进记录
  _tip; // 当前容器位置
  _blockParseCreater; // 块创建器：根据行首字符创建不同的 AST 节点类型（采用责任链模式）
  _currentLine; // 当前正在处理的行
  _nextLine; // 下一行
  _spaceInTab; // 当前 offset 在 tab 内剩余的空格数

  parse(md) {
    this._doc = new DocumentNode(0);
    return this._doc
  }
}
