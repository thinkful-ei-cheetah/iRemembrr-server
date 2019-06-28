'use strict';
const LL = require('../Algorithms/LinkedList');

function fillLinkedList(words) {
  let newLL = new LL();
  words.map(word => newLL.insertLast(word));
  return newLL;
}

function answerTrue(list, guess) {
  let item = list.getAt(0).value;
  if (guess === item.translation) {
    item.correct_count++;
    item.memory_value = item.memory_value + item.memory_value;
    return true;
  } else {
    item.incorrect_count++;
    item.memory_value = 1;
    return false;
  }
}

function moveHead(list, index){
  let item = list.getAt(0).value;
  
  list.remove(item);

  list.insertItemAt(item, index);
}

module.exports = { fillLinkedList, answerTrue, moveHead };