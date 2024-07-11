import { Test, TestingModule } from '@nestjs/testing';
import { TestOrmController } from './test-orm.controller';
import { AppModule } from '../app.module';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';

describe('TestOrmController', () => {
  let controller: TestOrmController;

  beforeEach(async () => {
    initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

    // const module: TestingModule = await Test.createTestingModule({
    //   controllers: [TestOrmController],
    // }).compile();

    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    controller = module.get<TestOrmController>(TestOrmController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
