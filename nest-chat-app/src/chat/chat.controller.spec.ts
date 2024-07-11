import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { AppModule } from '../app.module';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';

describe('ChatController', () => {
  let controller: ChatController;

  beforeEach(async () => {
    initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

    // const module: TestingModule = await Test.createTestingModule({
    //   imports: [DatabaseModule, TestOrmModule, ChatModule],
    //   controllers: [ChatController],
    //   providers: [ChatService, Logger],
    // }).compile();

    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    controller = module.get<ChatController>(ChatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
