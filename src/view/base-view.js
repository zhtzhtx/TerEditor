import { debounce } from "../utils/debounce";
import markdown from "../markdown-parse"
import { EVENT_TYPE } from "../const";

export class BaseView {
  constructor(textModel, selectionModel, viewContainer) {
    this._textModel = textModel;
    this._selectionModel = selectionModel;
    this._viewContainer = viewContainer;
    this._viewContainer.setAttribute("contenteditable", "true");
    this._events = {};
    this.addListeners();
  }
  addListeners() {
    // 模型事件
    this._renderBinder = this.render.bind(this);
    // 模型事件触发已经节流，此处不需节流
    this._textModel.on(EVENT_TYPE.TEXT_CHANGE, this._renderBinder);
    // dom 选区事件
    this._domSelectionChangeHandlerBinder = debounce(
      this.domSelectionChangeHandler.bind(this),
      100
    );
    window.document.addEventListener(
      "selectionchange",
      this._domSelectionChangeHandlerBinder
    );
  }
  render() {
    const html = markdown.md2html(this._textModel.getSpacer())
    this._viewContainer.innerHTML = html;
    this.updateDomSelection();
  }
  /** 鼠标或键盘导致的原生 dom 选区变化，同步到选区模型 */
  domSelectionChangeHandler(e) {
    const domSelection = window.getSelection();
    let selection = null;
    if (domSelection) {
      selection = this.domSelToCustomSel(domSelection);
    }
    this.showMarker(domSelection);
    this.emit(EVENT_TYPE.SELECTION_CHANGE, selection);
  }
  /** 将 Dom 真实选区转换成选区模型 */
  domSelToCustomSel(domSelection) {
    let selection = { anchor: 0, focus: 0 };
    if (domSelection.anchorNode) {
      const anchorIndex = this.domPointToCustomPoint({
        domNode: domSelection.anchorNode,
        domOffset: domSelection.anchorOffset,
      });
      const focusIndex = domSelection.isCollapsed
        ? anchorIndex
        : this.domPointToCustomPoint({
          domNode: domSelection.focusNode,
          domOffset: domSelection.focusOffset,
        });
      selection = { anchor: anchorIndex, focus: focusIndex };
    }
    return selection
  }
  /** 更新 dom 真实选区 */
  updateDomSelection() {
    const domSelection = window.getSelection();
    if (domSelection) {
      const selectionFromModel = this._selectionModel.getSelection();
      domSelection.removeAllRanges();
      const range = this.customSelToDomSel(selectionFromModel);
      if (range) {
        domSelection.addRange(range);
        // 立即调用showmarker，避免在marker之间输入时，marker触发延时导致闪烁的问题
        this.showMarker(domSelection);
      }
    }
  }
  /** 将选区模型转换成 Dom 的真实选区 */
  customSelToDomSel(customSelection) {
    let range = null;
    if (customSelection) {
      const rangeStart = this.customPointToDomPoint(customSelection.anchor);
      const rangeEnd =
        customSelection.anchor === customSelection.focus
          ? rangeStart
          : this.customPointToDomPoint(customSelection.focus);
      if (rangeStart && rangeEnd) {
        range = window.document.createRange();
        range.setStart(rangeStart.domNode, rangeStart.domOffset);
        range.setEnd(rangeEnd.domNode, rangeEnd.domOffset);
      }
    }
    return range;
  }
  customPointToDomPoint(customPoint) {
    let container = this._viewContainer;
    let offset = 0;
    let eles;
    let domPoint = null;
    while (eles = container.childNodes) {
      if (eles.length === 0) {
        break;
      }
      // 前一个节点，若没有找到显性的区间节点，则可能使用上一个节点的末尾或者下一节点的开头
      let preChild = null;
      let preSourceIndex = null;
      let len = eles.length;
      for (let i = 0; i < len; i++) {
        const ele = eles[i];
        const soucrIndex = this._getNodeSource(ele);
        // 注意：源码映射的子元素之间不一定是连续的soucrIndex，但是有序的，因为有些元素是消耗了隐藏的soucrIndex。
        if (customPoint >= soucrIndex[0] && customPoint <= soucrIndex[1]) {
          container = ele;
          offset = customPoint - soucrIndex[0];
          break;
        } else if (customPoint < soucrIndex[0]) { // 说明目标在前面的隐性区间
          if (!preChild) { // 行首隐性区间
            container = ele;
            offset = 0;
          } else {
            container = preChild;
            offset = customPoint - preSourceIndex[0];
          }
          break;
        } else if (i === len - 1) { // 说明落在了行尾的隐性区间
          container = ele;
          offset = soucrIndex[1] - soucrIndex[0];
          break;
        }
        preChild = ele;
        preSourceIndex = soucrIndex;
      }
    }
    if (!(container instanceof Text) && offset > 0) { // offset=0时就保持原节点，否则无法兼容空p标签，即换行时光标无法自动落在空行
      if (container.nextSibling) {
        container = container.nextSibling;
        offset = 0;
      } else {
        container = container.parentElement;
        offset = container.childNodes.length;
      }
    }
    domPoint = {
      domNode: container,
      domOffset: offset
    }
    return domPoint;
  }
  /** 根据dom节点获取其源码映射区间 */
  _getNodeSource(domNode) {
    const sourceIndex = [0, 0];
    if (domNode instanceof Text) {
      const textL = domNode.length;
      if (domNode.previousElementSibling) {
        const preIndexStr = domNode.previousElementSibling.getAttribute('i');
        if (preIndexStr) {
          const preIndexRange = preIndexStr.split('-');
          sourceIndex[0] = parseInt(preIndexRange[1]);
          sourceIndex[1] = sourceIndex[0] + textL;
        }
      } else if (domNode.parentElement) {
        const parentIndexStr = domNode.parentElement.getAttribute('i');
        if (parentIndexStr) {
          const parentIndexRange = parentIndexStr.split('-');
          sourceIndex[0] = parseInt(parentIndexRange[0]);
          sourceIndex[1] = sourceIndex[0] + textL;
        }
      }
    } else {
      // 有时光标落在了p标签，或者换行产生新空行时,往下找一级
      let indexStr = domNode.getAttribute('i');
      if (!indexStr) {
        const children = domNode.childNodes;
        if (children.length) {
          domNode = children[0];
          indexStr = domNode.getAttribute('i');
        }
      }
      if (indexStr) {
        const indexRange = indexStr.split('-');
        sourceIndex[0] = parseInt(indexRange[0]);
        sourceIndex[1] = parseInt(indexRange[1]);
      }
    }
    return sourceIndex;
  }
  domPointToCustomPoint(domPoint) {
    console.log(domPoint)
    let domNode = domPoint.domNode;
    const sourceIndex = this._getNodeSource(domNode);
    let domOffset = domPoint.domOffset;
    let point = sourceIndex[0] + domOffset;
    if (!(domNode instanceof Text) && domOffset > 0) { // domOffset>0 ,因此一定存在子元素
      const childNodes = domNode.childNodes;
      const domOffsetSourceIndex = this._getNodeSource(childNodes[domOffset - 1]);
      point = domOffsetSourceIndex[1];
    }
    return point;
  }
  showMarker (domSelection) {
    const showMarkerNodes = document.querySelectorAll('.editor-marker:not(.hide)');
    for (let i = 0; i < showMarkerNodes.length; i++) {
      showMarkerNodes[i].setAttribute('class', 'editor-marker hide');
    }
    if (domSelection) {
      let markerNode = domSelection.anchorNode;
      if (markerNode instanceof Text) {
        markerNode = markerNode.parentNode;
      }
      while (markerNode) {
        let className = markerNode.getAttribute('class');
        if (className === 'web-editor-pre') {
          break;
        }
        if (className === 'editor-block') {
          if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].indexOf(markerNode.tagName) > -1) {
            const titleMarker = markerNode.querySelectorAll('.editor-marker.hide');
            for (let i = 0; i < titleMarker.length; i++) {
              titleMarker[i].setAttribute('class', 'editor-marker');
            }
          }
          break;
        }
        markerNode = markerNode.parentNode
      }
    }
  }
  // TODO: 发布订阅，先手写，后面会改
  on(event, fn) {
    if (!this._events[event]) {
      this._events[event] = [];
    }
    this._events[event].push(fn);
  }
  emit(event, data) {
    this._events[event].forEach((fn) => {
      fn(data);
    });
  }
}

export default BaseView;
