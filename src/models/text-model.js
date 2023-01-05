export class TextModel {
  constructor(spacers) {
    this.$spacers = spacers || "";
  }

  getSpacer() {
    return this.$spacers;
  }

  getLength() {
    return this.$spacers.length;
  }

  insert(spacerIndex, spacers) {
    const originalSpacers = this.$spacers;
    this.$spacers = originalSpacers.slice(0, spacerIndex) + spacers + originalSpacers.slice(spacerIndex);
  }
}

export default TextModel