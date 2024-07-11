import { Test } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';
import { INestApplication } from '@nestjs/common';
import { Socket, io } from 'socket.io-client';
// import { AppModule } from '../app.module';
// import {
//   initializeTransactionalContext,
//   StorageDriver,
// } from 'typeorm-transactional';

async function createNestApp(...gateways: any): Promise<INestApplication> {
  // initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

  const testingModule = await Test.createTestingModule({
    // imports: [AppModule],
    providers: gateways,
  }).compile();
  return testingModule.createNestApplication();
}

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let app: INestApplication;
  let ioClient: Socket;

  beforeEach(async () => {
    // Instantiate the app
    app = await createNestApp(ChatGateway);
    // Get the gateway instance from the app instance
    gateway = app.get<ChatGateway>(ChatGateway);
    // Create a new client that will interact with the gateway
    ioClient = io('http://localhost:3030', {
      autoConnect: true,
      transports: ['websocket', 'polling'],
    });

    app.listen(3010);
  });

  afterEach(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('should emit "pong" on "ping"', async () => {
    ioClient.connect();
    ioClient.emit('ping', 'Hello world!');
    await new Promise<void>((resolve) => {
      ioClient.on('connect', () => {
        console.log('connected');
      });
      ioClient.on('pong', (data) => {
        expect(data).toBe('Hello world!');
        console.log(`recv: ${data}`);
        resolve();
      });
    });
    ioClient.disconnect();
  });

  it('should emit "chat message"', async () => {
    ioClient.connect();
    ioClient.emit('chat', 'hi message...');
    await new Promise<void>((resolve) => {
      ioClient.on('connect', () => {
        console.log('connected');
      });

      ioClient.on('chat', (data) => {
        expect(data).toBe('hi message...');
        console.log(`recv: ${JSON.stringify(data)}`);
        resolve();
      });
    });
    ioClient.disconnect();
  });
});
