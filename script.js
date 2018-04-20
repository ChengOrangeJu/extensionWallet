

var nebula = new Object();
	nebula.data = 'nebula';
	nebula.rrrrrr = 'nnnnnnn';

console.log("nebula is defined:" + nebula);


// Event listener
document.addEventListener('message', function(e) {
    if (e.source != window)
        return;

    console.log("contentscript.js: received 'message' event:" + e.data );
    //port.postMessage({joke: "message form page"})
});






