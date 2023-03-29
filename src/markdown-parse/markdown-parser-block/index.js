import { DocumentNode, ParagraphNode, NodeType } from "../node";
import BlockCreaterFactory from "../markdown-block-creater/factory";

class MarkdownParserBlock {
  _doc; // 语法树,也是根节点
  _sourceIndex; // 整个字符串的当前位置,用于源码映射
  _offset; // 当前行当前处理的字符位置
  _column; // 缩进记录
  _tip; // 当前容器位置
  _blockParseCreater = new BlockCreaterFactory().build(); // 块创建器：根据行首字符创建不同的 AST 节点类型（采用责任链模式）
  _currentLine; // 当前正在处理的行
  _nextLine; // 下一行
  _spaceInTab; // 当前 offset 在 tab 内剩余的空格数

  parse(md) {
    this._doc = new DocumentNode(0);
    this._tip = this._doc;
    this._sourceIndex = 0;
    const lines = md.split(/\r\n|\n|\r/);
    const len = lines.length;
    for (let i = 0; i < len; i++) {
      const line = lines[i];
      this._nextLine = lines[i + 1];
      this._parseBlock(line);
      this._sourceIndex += line.length + 1; // + 1是为了模型的换行符，保持模型位置同步，但因为换行符不属于任何一行，所以调用finalize方法时需要 -1。
    }
    while (this._tip) {
      this._tip.finalize(this._sourceIndex - 1);
      this._tip = this._tip.parent;
    }
    return this._doc;
  }
  _parseBlock(line) {
    this._offset = 0;
    this._column = 0;
    this._currentLine = line;
    const container = this._beforeParse();
    if (!container) return;
    this._tip = container;
    let createResult;
    // 代码块内部不用进行块解析
    if (container.type !== NodeType.CodeBlock) {
      this._dealSpace();
      createResult = this._blockParseCreater.create({
        line: line,
        nextLine: this._nextLine,
        offset: this._offset,
        column: this._column,
        container: this._tip,
        sourceStart: this._sourceIndex + this._offset,
      });
      if (createResult) {
        this._addChild(createResult.mnode);
        this._fixOffsetAndColumn(
          createResult.offset,
          createResult.column,
          createResult.spaceInTab
        );
        if (createResult.mnode.type === NodeType.CodeBlock) {
          // 刚生成代码块，不用进行后续逻辑了，避免增加多余的空行
          return;
        }
      }
    }
    if (!this._tip.canContainText) {
      this._addChild(new ParagraphNode(this._sourceIndex_+ this._offset));
    }
    this._addLineText();
  }
  /** 检测段落延续，延续段落不需要新建节点，同时跳过对应的offset,相当于预处理一些工作 */
  _beforeParse() {
    let container = this._doc;
    const lineIndent = this._dealSpace();
    this._indent = lineIndent;
    while (container) {
      if (!container.open) {
        container = container.parent;
        break;
      }
      const continueResult = container.continue(
        this._currentLine,
        this._offset,
        this._column
      );
      if (continueResult) {
        // 预处理时可能需要变更指针，同时也就改变了下一次的dealSpace_计算indent结果
        this._fixOffsetAndColumn(
          continueResult.offset,
          continueResult.column,
          continueResult.spaceInTab
        );
        if (continueResult.end) {
          container.finalize(this.sourceIndex_ + this.offset_);
          return;
        }
        if (container.lastChild) {
          container = container.lastChild;
          this._dealSpace();
        } else {
          break;
        }
      } else {
        container = container.parent;
        break;
      }
    }
    // 结束未匹配到的底层节点
    while (container !== this._tip) {
      this._tip.finalize(this._sourceIndex - 1);
      this._tip = this._tip.parent;
    }
    return container;
  }
  _fixOffsetAndColumn(offset, column, spaceInTab) {
    if (offset > -1) {
      this._offset = offset;
    }
    if (column > -1) {
      this._column = column;
    }
    if (spaceInTab > -1) {
      this._spaceInTab = spaceInTab;
    }
  }
  // 计算每行首位的空格数
  _dealSpace() {
    const currentLine = this._currentLine;
    let c;
    // let offset = this.offset_;
    let column = this._column;
    while ((c = currentLine.charAt(this._offset)) !== "") {
      if (c === " ") {
        // 空格
        this._offset++;
        this._column++;
      } else if (c === "\t") {
        // tab
        this._offset++;
        this._column += 4 - (this._column % 4);
      } else {
        break;
      }
    }
    this._blank = c === "\n" || c === "\r" || c === "";
    return this._column - column;
  }
  _addChild(mnode) {
    while (!this._tip.canContain(mnode)) {
      this._tip.finalize(this.sourceIndex_ - 1);
      this._tip = this._tip.parent;
    }
    this._tip.appendChild(mnode);
    let lastChild = mnode;
    while (lastChild) {
      this._tip = lastChild;
      lastChild = lastChild.lastChild;
    }
  }
  _addLineText () {
    let stringContent = this._tip.getStringContent() || '';
    if (this._spaceInTab) { // 表示当前处于一个tab内部（一个tab 4个空格）
      this._offset += 1; // 补齐一个tab的空格
      // add space characters:
      const charsToTab = 4 - (this._column % 4);
      stringContent += " ".repeat(charsToTab);
    }
     if (this._tip.type === NodeType.Paragraph && this._tip.parent?.type === NodeType.Document) {
       // TODO 普通段落标签保留整行内容，包括行首空格，并修改源码坐标映射（待优化）
      stringContent += this._currentLine;
      this._tip.sourceStart = this._sourceIndex;
    } else {
      stringContent += this._currentLine.slice(this._offset);
    }
    this._tip.setStringContent(stringContent);
  }
}

export default MarkdownParserBlock;
