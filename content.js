'use strict';

var serverNameToGuid = {};
var tableElm;
var content;
const config = {childList: false, subtree: true};

function mainUpdate (mutationsList, observer) {
    tableElm = document.querySelector('tbody');
    console.log(mutationsList);
    console.log(tableElm);
}

function tableUpdate (mutationsList, observer) {
    tableElm = document.querySelector('tbody');
    console.log(mutationsList);
    console.log(tableElm);
}


const mainObserver = new MutationObserver(mainUpdate);
const tableObserver =  new MutationObserver(tableUpdate);

function init() {
    content = document.getElementById('content');
    mainObserver.observe(content, {childList:true});

}

console.log("Extension activated!");

init();
update();

