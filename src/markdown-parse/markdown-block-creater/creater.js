export class Creater {
  next;

  setNext(next) {
    this.next = next;
  }

  complete(task) {
    let completeResult = this.canComplete(task);
    if (!completeResult && this.next) {
      completeResult = this.next.complete(task);
    }
    return completeResult;
  }

  canComplete(task) {
    return null;
  }

  delete(task) {
    let deleteResult = this.canDelete(task);
    if (!deleteResult && this.next) {
      deleteResult = this.next.delete(task);
    }
    return deleteResult;
  }

  canDelete(task) {
    return null;
  }

  create(task) {
    let createResult = this.canCreate(task);
    if (!createResult && this.next) {
      createResult = this.next.create(task);
    }
    return createResult;
  }

  canCreate(task) {
    return null;
  }
}
export default Creater;
