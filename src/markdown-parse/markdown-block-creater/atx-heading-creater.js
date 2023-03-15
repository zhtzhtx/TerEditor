import Creater from "./creater";
import { HeadNode } from "../node";
import { advanceOffset } from "../funs";

export class AtxHeadingCreater extends Creater {
  canCreate(task) {
    let createResult = null;
    const match = task.line.slice(task.offset).match(/^#{1,6}(?:[ \t]+)/);
    if (match) {
      const result = advanceOffset(
        task.line,
        task.offset,
        task.column,
        match[0].length
      );
      createResult = {
        offset: result.offset,
        column: result.column,
        spaceInTab: result.spaceInTab,
        mnode: new HeadNode(task.sourceStart, match[0].trim().length)
      }
    }
    return createResult;
  }
}
export default AtxHeadingCreater;
