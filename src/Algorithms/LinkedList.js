'use strict';
class _Node {
  constructor(value, next) {
    this.value = value;
    this.next = next;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  insertFirst(item) {
    this.head = new _Node(item, this.head);
  }
  insertLast(item) {
    if (this.head === null) {
      this.insertFirst(item);
    } else {
      let tempNode = this.head;
      while (tempNode.next !== null) {
        tempNode = tempNode.next;
      }
      tempNode.next = new _Node(item, null);
    }
  }


  // had to look this one up. 
  insertItemAt(item, index) {
    if (this.head === null) {
      this.insertFirst(item);
    }
    if(index === 0){
      this.head = new _Node(item, this.head);
      return;
    }
    const previus = this.getAt(index -1);
    let newNode = new _Node(item);
    newNode.next = previus.next;
    previus.next = newNode;

    return this.head;

  }

  getAt(index) {
    let counter = 0;
    let node = this.head;
    while (node) {
      if (counter === index) {
        return node;
      }
      counter++;
      node = node.next;
    }
    return null;
  }

  find(item) {
    let currNode = this.head;

    if (!this.head) {
      return null;
    }

    while (currNode.value !== item) {
      if (currNode.next === null) {
        return null;
      } else {
        currNode = currNode.next;
      }
    }

    return currNode;
  }


  remove(item) {
    if (!this.head) {
      return null;
    }

    if (this.head.value === item) {
      this.head = this.head.next;
      return;
    }

    let currNode = this.head;
    let previusNode = this.head;

    while ((currNode !== null) && (currNode.value !== item)) {
      previusNode = currNode;
      currNode = currNode.next;
    }
    if (currNode === null) {
      console.log('Item not Found');
      return;
    }
    previusNode.next = currNode.next;
  }
}

function main() {
  let list = new LinkedList();

  list.insertLast('1st');
  list.insertLast('3rd');
  list.insertLast('4th');

  list.insertItemAt('2nd', 1);

  return list.find('3rd');
}

console.log(main());
module.exports = LinkedList;