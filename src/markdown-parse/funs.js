/** 当前位置前移，1个tab对应4个空格 */
export function advanceOffset(line, offset, column, count, forColumns) {
  let char, spaceInTab = 0;
  console.log(line);
  while (count > 0 && (char = line[offset])) {
    if (char === "\t") {
      spaceInTab = 4 - (column % 4); // 一个tab内还剩余多少个空格
      console.log(spaceInTab);
      if (forColumns) {
        const inTab = spaceInTab > count; // 剩余空格足够满足本次移动
        const columnDelta = inTab ? count : spaceInTab; // 最多移动一个tab
        offset += inTab ? 0 : 1; // 剩余空格足够满足本次移动,则offset不用移动，说明在一个tab字符内
        column += columnDelta;
        count -= columnDelta;
      } else {
        column += spaceInTab;
        spaceInTab = 0;
        offset += 1;
        count -= 1;
      }
    } else {
      offset += 1;
      column += 1;
      count -= 1;
    }
  }
  return { offset, column, spaceInTab };
}
