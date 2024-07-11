import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './chat.entity';
import { Repository } from 'typeorm';
// import { Transactional } from 'typeorm-transactional';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
  ) {}

  findAll(): Promise<Chat[]> {
    return this.chatRepository.find();
  }

  async update(id: number, testOrm: Chat): Promise<void> {
    const existedTestOrm = await this.chatRepository
      .find({
        where: [{ id: id }],
      })
      .then((result) => result[0]);

    if (existedTestOrm) {
      await this.chatRepository.update(id, testOrm);
    }
  }
}
