
var container = document.head||document.documentElement
/*

*/

var s1 = document.createElement('script1');
s1.src = chrome.extension.getURL('script1.js');
container.insertBefore(s1, container.children[0])
//s1.onload = function() {s1.remove();};

var s = document.createElement('script');
s.src = chrome.extension.getURL('script.js');
container.insertBefore(s, container.children[0])
//s.onload = function() {s.remove();};

var i = document.createElement('inpage');
i.src = chrome.extension.getURL('inpage.js');
container.insertBefore(i, container.children[0])
//i.onload = function() {    i.remove();};



var port = chrome.runtime.connect({name: "contentscript"});
port.postMessage({joke: "Knock knock"});

port.onMessage.addListener(function(msg) {
    console.log("msg listened: " +JSON.stringify(msg));
    if (msg.question == "Who's there?")
        port.postMessage({answer: "Madame"});
    else if (msg.question == "Madame who?")
        port.postMessage({answer: "Madame... Bovary"});
});

function _sendMsg(json){
    port.postMessage(json);
}

function outputObj(obj) {
    var description = "";
    for (var i in obj) {
        description += i + " = " + obj[i] + "\n";
    }
    console.log(description);
}

// Event listener
window.addEventListener('message', function(e) {
    // e.detail contains the transferred data (can be anything, ranging
    // from JavaScript objects to strings).

    //if (e.source != window)
    //    return;

    console.log("contentscript.js: received message event:" + ", stringify msg.data: "+JSON.stringify(e.data) );
    outputObj(e)
    port.postMessage({type: "msgFromPage"})
});

