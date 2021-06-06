declare module "node-media-server" {
  class NodeMediaServer {
    constructor(config: NodeMediaServer.NodeMediaServerConfig);

    run(): void;

    stop(): void;

    getSession(id: string): NodeMediaServer.NodeMediaServerSession;

    on(
      eventName: NodeMediaServer.NodeMediaServerConnectEvents,
      listener: (
        id: string,
        args: NodeMediaServer.NodeMediaServerConnectEventArgs
      ) => void
    ): void;
    on(
      eventName:
        | NodeMediaServer.NodeMediaServerPublishEvents
        | NodeMediaServer.NodeMediaServerPlayEvents,
      listener: (
        id: string,
        streamPath: string,
        args: NodeMediaServer.NodeMediaServerPublishPlayEventArgs
      ) => void
    ): void;
  }

  namespace NodeMediaServer {
    type NodeMediaServerPublishEvents =
      | "prePublish"
      | "postPublish"
      | "donePublish";

    type NodeMediaServerPlayEvents = "prePlay" | "postPlay" | "donePlay";

    type NodeMediaServerConnectEvents =
      | "preConnect"
      | "postConnect"
      | "doneConnect";

    interface NodeMediaServerConnectEventArgs {
      app: string;
      type: string;
      flashVer: string;
      swfUrl: string;
      tcUrl: string;
      [index: string]: string | undefined;
    }

    interface NodeMediaServerPublishPlayEventArgs {
      [index: string]: string | undefined;
    }

    interface NodeMediaServerConfig {
      rtmp?: NodeMediaServerRtmpConfig;
      http?: NodeMediaServerHttpConfig;
    }

    interface NodeMediaServerRtmpConfig {
      port?: number;
      chunk_size?: number;
      gop_cache?: boolean;
      ping?: number;
      ping_timeout?: number;
    }

    interface NodeMediaServerHttpConfig {
      port?: number;
      allow_origin?: string;
    }

    interface NodeMediaServerSession {
      reject(): void;
    }
  }

  export = NodeMediaServer;
}
