'use strict';
const LL = require('../Algorithms/LinkedList');

function fillLinkedList(words) {
  let newLL = new LL();
  words.map(word => newLL.insertLast(word));
  return newLL;
}

function answerTrue(list, guess) {
  let item = list.getAt(0).value;
  let m = item.memory_value;
  if (guess === item.translate) {
    item.correct_count++;
    m = m * 2;
    return true;
  } else {
    item.incorrect_count++;
    m = 1;
    return false;
  }
}
function moveHead(list, index){
  let item = list.getAt(0).value;
  list.remove(item);

  list.insertItemAt(item, index);
}



module.exports = { fillLinkedList, answerTrue, moveHead };