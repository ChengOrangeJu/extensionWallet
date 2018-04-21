// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

var msgCount = 0;
var unapprovedTxCount = 0;
var unapprovedTxs = [];

var AccAddress ;

var bg_port = chrome.runtime.connect({name: "background"});
bg_port.postMessage({src: "background",dst:"all"});
bg_port.onMessage.addListener(function(msg) {
    console.log("msg listened: " + JSON.stringify(msg));

});

/*
massage format is basically like this:
{
	src: "",
	dst: "",
	data: {}
}
*/
chrome.runtime.onConnect.addListener(function(port) {
	console.log("Connected ....." + port.name );

	port.onMessage.addListener(function(msg) {

        msgCount ++;
        console.log("msgCount:" + msgCount );
        console.log("msg listened: " + JSON.stringify(msg));

		if (msg.src === 'contentScript'){       //message from webpage(DApp page)
		    if(!msg.data)
		        return;
		    if(msg.data.method === "neb_sendTransaction"){
                unapprovedTxCount ++;
                console.log("unapprovedTxCount:" + unapprovedTxCount);
                chrome.browserAction.setBadgeText({text: unapprovedTxCount.toString()});
                unapprovedTxs.push(msg.data)
                chrome.windows.create({'url': 'html/sendNas_popout.html', 'type': 'popup'}, function(window) {
                });
            }
            else if(msg.data.method === "getAccount")
                port.postMessage({
                    account: AccAddress
                })
        }
        else if (msg.src === 'popup'){      //message from extension popup page
		    console.log("msgFromPopup!" )
            if(!msg.data)
                return;
            if(!!msg.data.AccAddress){
                AccAddress = msg.data.AccAddress;
                port.postMessage({
                    unapprovedTxCount : unapprovedTxCount,
                    unapprovedTxs : unapprovedTxs
                })
            }
            else if(!!msg.data.Receipt){
                console.log("Receipt: " + JSON.stringify(msg.data.Receipt));
                chrome.tabs.query({}, function(tabs){
                    for (var i=0; i<tabs.length; ++i) {
                        chrome.tabs.sendMessage(tabs[i].id, {receipt: msg.data.Receipt});
                    }
                });

            }
        }
	});
});

