import { Test, TestingModule } from '@nestjs/testing';
import { WsChatService } from './ws-chat.service';

describe('WsChatService', () => {
  let service: WsChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WsChatService],
    }).compile();

    service = module.get<WsChatService>(WsChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
