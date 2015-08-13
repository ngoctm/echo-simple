package org.cometd.primer;

/**
 * Created by ngoctm on 8/12/15.
 */
import org.cometd.annotation.*;
import org.cometd.bayeux.server.*;
import org.cometd.server.BayeuxServerImpl;
import org.cometd.server.authorizer.GrantAuthorizer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import java.util.Map;

public class CometDDemoServlet extends HttpServlet
{
  private static final Logger logger = LoggerFactory.getLogger(CometDDemoServlet.class);

  @Override
  public void init() throws ServletException
  {
    super.init();
    final BayeuxServerImpl bayeux = (BayeuxServerImpl)getServletContext().getAttribute(BayeuxServer.ATTRIBUTE);

    ServerAnnotationProcessor processor = new ServerAnnotationProcessor(bayeux);
    processor.process(new EchoRPC());
  }

  @Override
  public void destroy()
  {
    super.destroy();
  }

  @Service("echo")
  public static class EchoRPC
  {
    @Configure("/service/echo")
    private void configureEcho(ConfigurableServerChannel channel)
    {
      channel.addAuthorizer(GrantAuthorizer.GRANT_SUBSCRIBE_PUBLISH);
    }

    @RemoteCall("echo")
    public void doEcho(RemoteCall.Caller caller, Map<String, Object> data)
    {
      logger.info("ECHO from " + caller.getServerSession() + ": " + data);
      caller.result(data);
    }
  }
}
