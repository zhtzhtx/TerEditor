import { NodeType, TextNode } from "../node";

class MarkdownParserLine {
  _block;
  _line;
  _sourceStart;
  _offset; // 当前处理的字符位置
  _delimiter = null;
  _aligns = []; // table中的对齐方向
  static whiteSpaceReg = /^\s/; // 空格 tab等
  static textReg = /^[^\[\]\|\\<!*_~`]+/m; // 普通文本

  parse(mnode) {
    this._block = mnode;
    this._setBlockMarkerBefore();
    this._line = mnode.stringContent || '';
    // 表格下一个空白行不显示，避免后续输入被表格继承
    if (this._line.length === 0 && this._block.prev?.type === NodeType.Table) {
      this._block.isShow = false;
      return;
    }
    this._offset = 0;
    this._delimiter = null;
    this._parseLine();
  }
  _parseLine () {
    if (!this._line) {
      this._block.appendChild(new TextNode(this.sourceStart_, ''));
      return;
    }
    let char;
    while (char = this._line[this._offset]) {
      switch (char) {
        default:
          this._parseText();
          break;
      }
    }
  }
  /** 普通文本内容 */
  _parseText () {
    const matchText = this._match(MarkdownParserLine.textReg);
    if (matchText) {
      this._block.appendChild(new TextNode(this._sourceStart + this._offset - matchText.length, matchText));
    }
  }
  /** 对当前block节点进行marker设置补充，如标题 */
  _setBlockMarkerBefore() {
    const blockMarkerBefore = this._block.blockMarkerBefore;
    if (blockMarkerBefore) {
      const markerNode = new TextNode(
        this._block.sourceStart,
        blockMarkerBefore
      );
      markerNode.marker = "before";
      this._block.appendChild(markerNode);
      this._sourceStart = markerNode.sourceEnd;
    } else {
      this._sourceStart = this._block.sourceStart;
    }
  }
  _match (reg) {
    const match = reg.exec(this._line.slice(this._offset));
    if (match) {
      this._offset += match[0].length;
      return match[0];
    } else {
      return null;
    }
  }
}

export default MarkdownParserLine;
