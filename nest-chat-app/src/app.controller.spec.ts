import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';
import { TestOrmModule } from './test-orm/test-orm.module';
import { DatabaseModule } from './common_modules/database.module';
import { AppModule } from './app.module';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

    // const app: TestingModule = await Test.createTestingModule({
    //   imports: [
    //     ConfigModule.forRoot({
    //       isGlobal: true,
    //       envFilePath: `.env`,
    //     }),
    //     DatabaseModule,
    //     TestOrmModule,
    //     ChatModule,
    //   ],
    //   controllers: [AppController],
    //   providers: [AppService, Logger],
    // }).compile();

    const app: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello !', () => {
      expect(appController.getHello()).toBe('Hello !');
    });
  });
});
