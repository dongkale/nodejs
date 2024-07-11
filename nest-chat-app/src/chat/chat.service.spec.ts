import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { AppModule } from '../app.module';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';

describe('ChatService', () => {
  let service: ChatService;

  beforeEach(async () => {
    initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

    // const module: TestingModule = await Test.createTestingModule({
    //   imports: [DatabaseModule, TestOrmModule, ChatModule],
    //   providers: [ChatService, Logger],
    // }).compile();

    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<ChatService>(ChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
