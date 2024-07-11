import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TestOrm } from './test-orm.entity';
import { Chat } from '../chat/chat.entity';
import { EntityNotFoundError, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
// import { ChatService } from '../chat/chat.service';
import { CreateTestOrmDto } from './dto/create-test-orm.dto';
import { UpdateTestOrmDto } from './dto/update-test-orm.dto';

@Injectable()
export class TestOrmService {
  private static readonly logger = new Logger(TestOrmService.name);

  constructor(
    @InjectRepository(TestOrm)
    private readonly testOrmRepository: Repository<TestOrm>,
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>, // private chatService: ChatService,
  ) {}

  async create(createTestormDto: CreateTestOrmDto): Promise<TestOrm> {
    // return this.testOrmRepository.save(createTestormDto);
    try {
      // const testOrm = new TestOrm();
      // testOrm.id = 0;
      // testOrm.name = createTestormDto.name;
      // testOrm.version = createTestormDto.version;
      const result = await this.testOrmRepository.save(createTestormDto);
      TestOrmService.logger.debug(result);
      return result;
    } catch (error) {
      TestOrmService.logger.debug(error);
      throw error;
    }
  }

  async findAll(): Promise<TestOrm[]> {
    // return this.testOrmRepository.find();

    try {
      const posts = await this.testOrmRepository.find();
      TestOrmService.logger.debug(posts);
      return posts;
    } catch (error) {
      TestOrmService.logger.debug(error);
      throw error;
    }
  }

  async findOne(id: number): Promise<TestOrm> {
    // return this.testOrmRepository.findOneBy({ id: id });

    // return this.testOrmRepository
    //   .find({
    //     where: [{ id: id }],
    //   })
    //   .then((result) => result[0]);

    try {
      const find = await this.testOrmRepository.findOneBy({ id: id });
      TestOrmService.logger.debug(find);
      return find;
    } catch (error) {
      TestOrmService.logger.debug(error);
      throw error;
    }
  }

  async remove(id: number) {
    // await this.testOrmRepository.delete(id);
    try {
      const post = await this.testOrmRepository.findOneBy({ id: id });
      if (!post) {
        throw new EntityNotFoundError(TestOrm, id);
      }
      TestOrmService.logger.debug(post);
      const result = await this.testOrmRepository.softDelete({
        id,
      });
      return result;
    } catch (error) {
      TestOrmService.logger.debug(error);
      throw error;
    }
  }

  //   async update(id: number, testOrm: TestOrm): Promise<TestOrm> {
  //     await this.testOrmRepository.update(id, testOrm);
  //     return this.testOrmRepository
  //       .find({
  //         where: [{ id: id }],
  //       })
  //       .then((result) => result[0]);
  //   }

  async update(id: number, updateTestOrm: UpdateTestOrmDto) {
    // const existedTestOrm = await this.testOrmRepository
    //   .find({
    //     where: [{ id: id }],
    //   })
    //   .then((result) => result[0]);

    // if (existedTestOrm) {
    //   await this.testOrmRepository.update(id, testOrm);
    // }

    try {
      const find = await this.testOrmRepository.findOneBy({ id: id });
      if (!find) {
        throw new EntityNotFoundError(TestOrm, id);
      }
      TestOrmService.logger.debug(find);
      const result = await this.testOrmRepository.save({
        ...find,
        ...updateTestOrm,
      });
      return result;
    } catch (error) {
      TestOrmService.logger.debug(error);
      throw error;
    }
  }

  async findOneById(id: number): Promise<TestOrm> {
    let testOrm: TestOrm = null;

    // testOrm = await this.testOrmRepository.findOne(id);
    // testOrm = await this.testOrmRepository.findOneBy({ id: id });
    testOrm = await this.testOrmRepository.findOne({ where: { id: id } });
    if (testOrm.id === 1) {
      throw new InternalServerErrorException('정지 당한 유저입니다.');
    }
    return testOrm;
  }

  @Transactional()
  async query__(): Promise<TestOrm> {
    // 같은 리포지토리에서 트랜젝션
    await this.testOrmRepository.query(
      `UPDATE test_orm SET version = '===' WHERE id=2`,
    );

    // throw new Error();

    await this.testOrmRepository.query(
      `UPDATE test_orm SET version = '=====' WHERE id=1`,
    );

    const s = await this.testOrmRepository.query(`SELECT * FROM test_orm`);

    // 다른 리포지토리에서 트랜젝션
    await this.testOrmRepository.query(
      `UPDATE test_orm SET version = '+++' WHERE id=1`,
    );

    throw new Error();

    await this.chatRepository.query(
      `UPDATE chat SET message = '+++' WHERE id=1`,
    );

    return s[1];
  }
}
