import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestOrmController } from './test-orm.controller';
import { TestOrmService } from './test-orm.service';
import { TestOrm } from './test-orm.entity';
import { Chat } from '../chat/chat.entity';
import { ChatService } from '../chat/chat.service';

@Module({
  imports: [TypeOrmModule.forFeature([TestOrm, Chat])],
  exports: [TestOrmService],
  controllers: [TestOrmController],
  providers: [TestOrmService, ChatService],
})
export class TestOrmModule {}
