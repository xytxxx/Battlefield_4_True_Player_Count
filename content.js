'use strict';

var serverNameToGuid = {};
var tableElm;
var content;
const config = {childList: false, subtree: true};

function httpGetAsync(url, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
}

function fixPlayerCount_cb(tr){
    return (resp) => {
        let data = JSON.parse(resp);
        let pc = 0;
        for (let i in data.snapshot.teamInfo){
            let teamInfo = data.snapshot.teamInfo[i];
            pc += Object.keys(teamInfo.players).length;
        }
        let pcElm = tr.querySelector('span.occupied');
        pcElm.innerText = pc;
        pcElm.style.color = "#66ff99";
    }
}

function trUpdate_cb(tr){
    let guid = tr.getAttribute('data-guid');
    let url = 'https://keeper.battlelog.com/snapshot/' + guid;
    return ()=> { httpGetAsync(url, fixPlayerCount_cb(tr)) };
}

var trObservers = [];

function tableUpdate () {
    console.log("table update");
    for (let ob of trObservers){
        ob.disconnect();
    }
    for (let tr of tableElm.rows){
        // callback function for this specific tr
        let cb = trUpdate_cb(tr);
        cb();
        var ob = new MutationObserver(cb);
        ob.observe(tr, {childList:true})
        trObservers.push(ob);
    }
}

const tableObserver =  new MutationObserver(tableUpdate);

function mainUpdate (mutationsList, observer) {
    tableElm = document.querySelector('tbody');
    tableObserver.observe(tableElm, {childList:true});
    console.log("main content update");
    tableUpdate();
}

const mainObserver = new MutationObserver(mainUpdate);

function init() {
    content = document.getElementById('content');
    mainObserver.observe(content, {childList:true});
}

console.log("Extension activated!");

init();
mainUpdate();

