
var port = chrome.runtime.connect({name: "popup"});
port.postMessage({src: "popup",dst:"background"});
port.onMessage.addListener(function(msg) {
    console.log("msg listened: " +JSON.stringify(msg));
    if (!! msg.unapprovedTxCount) {
        if(msg.unapprovedTxCount > 0) {
            var data = msg.unapprovedTxs[0].data
            console.log("to address: " + data.to + ", mount: " + data.value)
            $(".icon-address.to input").val(data.to);

            $("#amount").val(data.value);
        }
    }
});


chrome.runtime.onConnect.addListener(function(port) {
    console.log("Connected ....." + port.name);
    port.onMessage.addListener(function(msg) {
        console.log("msg listened: " + JSON.stringify(msg));
    })

})

document.addEventListener("DOMContentLoaded", function() {
    console.log("popout page loaded...")
    chrome.storage.local.get(['keyInfo'], function(result) {
        console.log('keyInfo Value is :' + JSON.stringify(result.keyInfo));
        result = JSON.parse(result.keyInfo)

        if(!!result){
            console.log("unlockFile:")
            UnlockFile(result.fileJson, result.password)
        }


    });
});

function outputObj(obj) {
    var description = "";
    for (var i in obj) {
        description += i + " = " + obj[i] + "\n";
    }
    console.log(description);
}


var AccAddress ;

function UnlockFile( fileJson, password) {
    console.log("\tfileJson: " + JSON.stringify(fileJson) )

    try {
        var address;
        var Account = require("nebulas").Account
        var account = Account.fromAddress(fileJson.address)

        account.fromKey(fileJson, password);
        address = account.getAddressString();
        gAccount = account;
        AccAddress = address;

        console.log("AccAddress got...")
        port.postMessage({
            src: "popup",
            dst:"background",
            data: {
                AccAddress : AccAddress
            }
        });

        console.log("\tfileJson: " + JSON.stringify(gAccount) )


        $(".icon-address.from input").val(address).trigger("input"); // gen icon from addr, needs trigger 'input' event if via set o.value
        $("#unlock").hide();
        $("#send").show();

        neb.api.getAccountState(address)
            .then(function (resp) {
                var nas = Unit.fromBasic(resp.balance, "nas").toNumber();
                console.log("\tbalance: " + nas +", nonce: " + resp.nonce)
                $("#balance").val(nas).trigger("input"); // add comma & unit from value, needs trigger 'input' event if via set o.value
                $("#nonce").val(parseInt(resp.nonce || 0) + 1);
            })
            .catch(function (e) {
                // this catches e thrown by nebulas.js!neb

                bootbox.dialog({
                    backdrop: true,
                    onEscape: true,
                    message: i18n.apiErrorToText(e.message),
                    size: "large",
                    title: "Error"
                });
            });
    } catch (e) {
        // this catches e thrown by nebulas.js!account
        console.log("unlockFile error:" + JSON.stringify(e))

    }
}









