import { NodeType, DocumentNode, HeadNode, ParagraphNode, TextNode } from '../node'

export class HtmlGenerate {
  _createTag(tagName, attrs, selfClosing) {
    let buffer = `<${tagName}`;
    if (attrs) {
      for (let attr of attrs) {
        buffer += ` ${attr[0]}="${attr[1]}"`;
      }
    }
    if (selfClosing) {
      buffer += ' /';
    }
    buffer += '>';
    return buffer;
  }
  _getSource(mnode, attrs = []) {
    attrs.push(['i', String(mnode.sourceStart || 0) + '-' + String(mnode.sourceEnd || 0)]);
    if (mnode.isParagraph) {
      attrs.push(['class', 'editor-block'])
    }
    return attrs;
  }

  [NodeType.Head](buffer, mnode, close) {
    const tagName = "h" + mnode.level;
    if (close) {
      buffer += this._createTag('/' + tagName);
    } else {
      buffer += this._createTag(tagName, this._getSource(mnode));
    }
    return buffer;
  }
  [NodeType.Text](buffer, mnode, close) {
    if (mnode.marker) {
      const attrs = [['class', `editor-marker hide`], ['m', mnode.marker]];
      buffer += this._createTag('span', this._getSource(mnode, attrs));
      buffer += this._createTag('/span');
    } else {
      buffer += mnode.text;
    }
    return buffer
  }
  [NodeType.Paragraph] (buffer, mnode, close) {
    if (mnode.isShow) {
      if (close) {
        buffer += this._createTag('/p');
      } else {
        buffer += this._createTag('p', this._getSource(mnode));
      }
    }
    return buffer;
  }
}

export default HtmlGenerate