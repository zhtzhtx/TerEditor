import AtxHeadingCreater from "./atx-heading-creater";

export class Factory {
  build () {
    const atxHeadingCreater = new AtxHeadingCreater();
    return atxHeadingCreater;
  }
}
export default Factory;