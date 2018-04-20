// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

var msgCount = 0;

chrome.runtime.onConnect.addListener(function(port) {
	console.log("Connected .....");
	console.assert(port.name == "contentscript");

	port.onMessage.addListener(function(msg) {

        console.log("msg listened: " + JSON.stringify(msg));

		if (msg.joke == "Knock knock")
			port.postMessage({question: "Who's there?"});
		else if (msg.answer == "Madame")
			port.postMessage({question: "Madame who?"});
		else if (msg.answer == "Madame... Bovary")
			port.postMessage({question: "I don't get it."});
		else if (msg.type == 'msgFromPage'){
            msgCount ++;
            console.log("msgCount:" + msgCount +  ", toString: "+ msgCount.toString());
            chrome.browserAction.setBadgeText({text: msgCount.toString()});
        }
	});
});


