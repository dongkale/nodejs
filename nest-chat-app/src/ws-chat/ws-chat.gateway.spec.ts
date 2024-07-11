import { Test } from '@nestjs/testing';
import { WsChatGateWay } from './ws-chat.gateway';
import { INestApplication } from '@nestjs/common';
// import { Socket, io } from 'ws';
// import { WsChatService } from './ws-chat.service';
import { WsAdapter } from '@nestjs/platform-ws'; //여기!!
import { WsChatModule } from './ws-chat.module';
import * as WebSocket from 'ws';

async function createNestApp(...gateways: any): Promise<INestApplication> {
  const testingModule = await Test.createTestingModule({
    // providers: [gateways],
    imports: [WsChatModule],
  }).compile();

  const app = testingModule.createNestApplication();
  app.useWebSocketAdapter(new WsAdapter(app) as any);

  return app;
}

describe('WsChatGateway (WsAdapter)', () => {
  // let gateway: WsChatGateWay;
  const websocketUrl = 'ws://localhost:3031';

  let app: INestApplication;
  let ws;

  beforeEach(async () => {
    app = await createNestApp(WsChatGateWay);
    // gateway = app.get<WsChatGateWay>(WsChatGateWay);

    app.listen(3011);
  });

  afterEach(async () => {
    await app.close();
  });

  // it('should be defined', () => {
  //   expect(gateway).toBeDefined();
  // });

  it('should emit "ping"', async () => {
    ws = new WebSocket(websocketUrl);

    const testString = 'Hello world!';
    const testEvent = 'ping';

    await new Promise<void>((resolve) =>
      ws.on('open', () => {
        console.log('connected(ws)');
        resolve();
      }),
    );

    ws.on('close', () => {
      console.log('disconnected(ws)');
    });

    ws.on('message', (data) => {
      console.log(data);
      console.log(JSON.parse(JSON.stringify(data)));
      console.log(`recv: ${data}`);

      // const __str = new TextDecoder().decode(data);
      // console.log(`=== ${JSON.parse(JSON.stringify(__str))}`);

      // data ==> ArrayBuffer 형으로 decode가 필요함;
      // expect(new TextDecoder().decode(data)).toEqual(testString);
      expect(new TextDecoder().decode(data)).toBe(testString);

      ws.close();
    });

    ws.send(
      JSON.stringify({
        event: testEvent,
        data: testString,
      }),
    );
  });

  it('should emit "ping2"', async () => {
    ws = new WebSocket(websocketUrl);

    const testString = 'Hello world!';
    const testEvent = 'ping';

    await new Promise<void>((resolve) =>
      ws.on('open', () => {
        console.log('connected(ws)');

        ws.on('close', () => {
          console.log('disconnected(ws)');
        });

        ws.on('message', (data) => {
          console.log(data);
          console.log(JSON.parse(JSON.stringify(data)));
          console.log(`recv: ${data}`);

          expect(new TextDecoder().decode(data)).toBe(testString);
          ws.close();
        });

        ws.send(
          JSON.stringify({
            event: testEvent,
            data: testString,
          }),
        );
        resolve();
      }),
    );

    // await new Promise<void>((resolve) =>
    //   ws.on('message', (data) => {
    //     console.log(`recv: ${JSON.stringify(data)}`);
    //     expect(data).toBe('test');
    //     ws.close();
    //     resolve();
    //   }),
    // );
  });

  // it('should emit "pong" on "ping"', async () => {
  //   ioClient.connect();
  //   ioClient.emit('ping', 'Hello world!');
  //   await new Promise<void>((resolve) => {
  //     ioClient.on('connect', () => {
  //       console.log('connected');
  //     });
  //     ioClient.on('pong', (data) => {
  //       expect(data).toBe('Hello world!');
  //       console.log(`recv: ${data}`);
  //       resolve();
  //     });
  //   });
  //   ioClient.disconnect();
  // });

  //   it('should emit "chat message"', async () => {
  //     ioClient.connect();
  //     ioClient.emit('chat', 'hi message...');
  //     await new Promise<void>((resolve) => {
  //       ioClient.on('connect', () => {
  //         console.log('connected');
  //       });

  //       ioClient.on('chat', (data) => {
  //         expect(data).toBe('hi message...');
  //         console.log(`recv: ${data}`);
  //         resolve();
  //       });
  //     });
  //     ioClient.disconnect();
  //   });
});
