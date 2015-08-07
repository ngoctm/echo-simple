require({
            baseUrl: "./jquery",
            paths: {
                // Libraries
                jquery: "jquery-2.1.4",
                org: "../org"
            }
        },
["jquery", "jquery.cometd", "jquery.cometd-timestamp", "jquery.cometd-reload"/*, "jquery.cometd-ack"*/],
function($)
{
    var cometd = $.cometd;
    $(document).ready(function()
    {
        function _connectionEstablished()
        {
            $('#body').append('<div>CometD Connection Established</div>');
        }

        function _connectionBroken()
        {
            $('#body').append('<div>CometD Connection Broken</div>');
        }

        function _connectionClosed()
        {
            $('#body').append('<div>CometD Connection Closed</div>');
        }

        // Function that manages the connection status with the Bayeux server
        var _connected = false;
        function _metaConnect(message)
        {
            if (cometd.isDisconnected())
            {
                _connected = false;
                _connectionClosed();
                return;
            }

            var wasConnected = _connected;
            _connected = message.successful === true;
            if (!wasConnected && _connected)
            {
                _connectionEstablished();
            }
            else if (wasConnected && !_connected)
            {
                _connectionBroken();
            }
        }

        // Function invoked when first contacting the server and
        // when the server has lost the state of this client
        function _metaHandshake(handshake)
        {
            if (handshake.successful === true)
            {
                cometd.batch(function()
                {
                    cometd.subscribe('/hello', function(message)
                    {
                        $('#body').append('<div>Server Says: ' + message.data.greeting + '</div>');
                    });
                    // Publish on a service channel since the message is for the server only
                    cometd.publish('/service/hello', { name: 'World' });
                    echoRpc("Type something in the textbox above");
                });
            }
        }

        var sendB = $("#sendB");
        sendB.on("click", function()
        {
            echoRpc(phrase.val());
            phrase.val("");
            return false;
        });

        function echoRpc(text)
        {
            console.debug("Echoing", text);

            cometd.remoteCall("application", {msg: text}, function(reply)
            {
                var responses = $("#responses");
                responses.html(responses.html() +
                 // (reply.timestamp || "") + " Echoed by server: " + reply.data.msg + "<br/>");
                 (reply.timestamp || "") + " Echoed by server: " + reply.data + "<br/>");
            });
        }

        $(window).on("beforeunload", cometd.reload);

        var phrase = $("#phrase");
        phrase.attr("autocomplete", "OFF");
        phrase.on("keyup", function(e)
        {
            if (e.keyCode == 13)
            {
                echoRpc(phrase.val());
                phrase.val("");
                return false;
            }
            return true;
        });


        cometd.websocketEnabled = false;

        // Disconnect when the page unloads
        $(window).unload(function()
        {
            cometd.disconnect(true);
        });

        var cometURL = location.protocol + "//" + location.host + config.contextPath + "/cometd";
        cometd.configure({
            url: cometURL,
            logLevel: 'debug'
        });

//        cometd.addListener('/meta/handshake', _metaHandshake);
        cometd.addListener("/meta/handshake", function(reply)
        {
            if (reply.successful)
            {
                echoRpc("Type something in the textbox above");
            }
        });
        cometd.addListener('/meta/connect', _metaConnect);

        cometd.handshake();
    });
});
