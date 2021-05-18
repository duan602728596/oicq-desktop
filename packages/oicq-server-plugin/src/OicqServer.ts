import * as http from 'http';
import type { Server, IncomingMessage } from 'http';
import type { Socket } from 'net';
import * as Koa from 'koa';
import type { Context, Next } from 'koa';
import * as Router from '@koa/router';
import * as body from 'koa-body';
import * as ws from 'ws';
import * as _ from 'lodash';
import type { Client, SystemEventData, MessageEventData, RequestEventData, NoticeEventData } from 'oicq';
import { formatList, formatGml } from './formatData';
import type { InfoItem } from './types';

if (typeof SharedArrayBuffer !== 'function') {
  // @ts-ignore
  global.SharedArrayBuffer = function(): void {
    throw new Error('当前环境不存在SharedArrayBuffer函数。');
  };
}

interface OicqServerArgs {
  port: number; // 端口
  bot: Client;
}

class OicqServer {
  public port: number;
  public app: Koa;
  public router: Router;
  public wsServer: ws.Server;
  public httpServer: Server;
  public sockets: Array<ws> = [];
  public bot: Client;

  constructor(oicqServerArgs: OicqServerArgs) {
    this.port = oicqServerArgs.port;         // 端口
    this.bot = oicqServerArgs.bot;           // 机器人
    this.app = new Koa();                    // koa服务
    this.router = new Router();              // koa-router
    this.wsServer = new ws.Server({  // websocket服务
      noServer: true,
      path: '/ws'
    });
  }

  /* server的upgrade事件 */
  handleHttpServerUpgrade(req: IncomingMessage, sock: Socket, head: Buffer): void {
    this.wsServer.handleUpgrade(req, sock, head, (connection: ws): void => {
      if (!this.wsServer.shouldHandle(req)) {
        return;
      }

      this.wsServer.emit('connection', connection, req);
    });
  }

  /* websocket的connection事件 */
  handleWsServerConnection(connection: ws): void {
    // 断开连接
    connection.on('close', (): void => {
      const index: number = _.findIndex(this.sockets, connection);

      if (index >= 0) {
        this.sockets.splice(index, 1);
      }
    });

    this.sockets.push(connection);
  }

  /* oicq监听的事件 */
  handleOicqEventFunc(event: SystemEventData | MessageEventData | RequestEventData | NoticeEventData): void {
    for (const socket of this.sockets) {
      socket.send(JSON.stringify(event));
    }
  }

  /* 通过接口触发事件 */
  async actionRouter(ctx: Context, next: Next): Promise<void> {
    const postBody: { type: string; payload: Array<any> } = ctx.request.body;

    if (typeof this.bot[postBody.type] === 'function') {
      const args: Array<string> = postBody.payload ?? [];

      if (Array.isArray(args)) {
        ctx.body = await this.bot[postBody.type](...args);
      } else {
        ctx.status = 400;
        ctx.body = {
          retcode: 404,
          status: 'The type of the parameter "payload" is wrong'
        };
      }
    } else {
      ctx.status = 404;
      ctx.body = {
        retcode: 404,
        status: 'Method does not exist'
      };
    }
  }

  // 获取成员变量
  varRouter(ctx: Context, next: Next): void {
    const { varName }: { varName: string } = ctx.params;

    if (varName in this.bot) {
      let data: InfoItem | any = this.bot[varName];

      if (['fl', 'sl', 'gl'].includes(varName)) {
        data = formatList(data);
      }

      if (varName === 'gml') {
        data = formatGml(data);
      }

      ctx.body = { data };
    } else {
      ctx.status = 404;
      ctx.body = {
        retcode: 404,
        status: 'Variable does not exist'
      };
    }
  }

  /* 初始化服务，包括创建中间件等 */
  init(): void {
    // post body
    this.app.use(body());

    // router
    this.app.use(this.router.routes())
      .use(this.router.allowedMethods());

    // 接口
    this.router.post('/oicq/action', this.actionRouter.bind(this));
    this.router.get('/oicq/var/:varName', this.varRouter.bind(this));

    // server
    this.httpServer = http.createServer(this.app.callback());

    // websocket
    this.httpServer.on('upgrade', this.handleHttpServerUpgrade.bind(this));
    this.wsServer.on('connection', this.handleWsServerConnection.bind(this));

    // oicq监听
    this.bot.on('system', this.handleOicqEventFunc.bind(this));
    this.bot.on('message', this.handleOicqEventFunc.bind(this));
    this.bot.on('request', this.handleOicqEventFunc.bind(this));
    this.bot.on('notice', this.handleOicqEventFunc.bind(this));

    this.httpServer.listen(this.port);
  }

  /* 关闭连接 */
  destroy(): void {
    this.wsServer.close();
    this.httpServer.close();
  }
}

export default OicqServer;