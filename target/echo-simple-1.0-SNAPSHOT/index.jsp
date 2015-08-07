<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
    <script type="text/javascript" src="${pageContext.request.contextPath}/jquery/jquery-2.1.4.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/org/cometd.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/jquery/jquery.cometd.js"></script>
    <script data-main="application"  src="require.js"></script>
    <%--
    The reason to use a JSP is that it is very easy to obtain server-side configuration
    information (such as the contextPath) and pass it to the JavaScript environment on the client.
    --%>
    <script type="text/javascript">
        var config = {
            contextPath: '${pageContext.request.contextPath}'
        };
    </script>
</head>
<body>

    <div id="body"></div>

    <h1>Echo test</h1>
    <p>
        Echo data to ONLY this client using RPC style messaging over
        cometd. Requires a server side component at /service/echo which echos
        responses directly to the client.
    </p>

    <div>
        <label for="phrase">Echo: </label><input id="phrase" type="text" />
        <input id="sendB" class="button" type="submit" name="join" value="Send"/>
    </div>
    <pre id="responses"></pre>
</body>
</html>
