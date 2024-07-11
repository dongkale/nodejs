import { Module } from '@nestjs/common';
import { WsChatGateWay } from './ws-chat.gateway';
import { WsChatService } from './ws-chat.service';

@Module({
  imports: [],
  controllers: [],
  providers: [WsChatGateWay, WsChatService],
})
export class WsChatModule {}
