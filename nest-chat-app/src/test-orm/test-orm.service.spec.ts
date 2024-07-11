import { Test, TestingModule } from '@nestjs/testing';
import { TestOrmService } from './test-orm.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TestOrm } from '../test-orm/test-orm.entity';
import {
  EntityNotFoundError,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { Chat } from '../chat/chat.entity';
import { ChatService } from '../chat/chat.service';
import { InternalServerErrorException } from '@nestjs/common';

const mockTestOrmRepository = () => ({
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
  softDelete: jest.fn(),
});

class MockCustomRepository {
  // async findOneBy(options: FindOptionsWhere<TestOrm>): Promise<TestOrm> {
  //   const testOrm: TestOrm = new TestOrm();

  //   testOrm.id = options.id as number;
  //   // testOrm.id = options..where as number;

  //   // console.log(
  //   //   `Call MockCustomRepository.fineOne(${options.where}) => ${testOrm}`,
  //   // );

  //   return testOrm;
  // }

  async findOne(options: FindOneOptions<TestOrm>): Promise<TestOrm> {
    const testOrm: TestOrm = new TestOrm();

    testOrm.id = Array.isArray(options.where)
      ? (options.where[0]?.id as number)
      : (options.where?.id as number);

    // console.log(
    //   `Call MockCustomRepository.fineOne(${options.where}) => ${testOrm}`,
    // );

    return testOrm;
  }
}

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('TestOrmService', () => {
  let service: TestOrmService;
  let repository: MockRepository<TestOrm>;
  let repositoryChat: MockRepository<Chat>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestOrmService,
        {
          provide: getRepositoryToken(TestOrm),
          useValue: mockTestOrmRepository(),
          // useClass: MockCustomRepository,
        },
        ChatService,
        {
          provide: getRepositoryToken(Chat),
          useValue: mockTestOrmRepository(),
        },
      ],
    }).compile();

    service = module.get<TestOrmService>(TestOrmService);
    repository = module.get<MockRepository<TestOrm>>(
      getRepositoryToken(TestOrm),
    );

    repositoryChat = module.get<MockRepository<Chat>>(
      getRepositoryToken(TestOrm),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create()', () => {
    const createArgs = {
      name: 'name_11',
      version: 'version_11',
    };

    it('should fail on exception', async () => {
      // repository.save() error 발생
      repository.save.mockRejectedValue('save error'); // 실패할꺼라고 가정한다.

      const result = await service.create(createArgs);
      // console.log('result:', result);
      expect(result).toEqual('save error'); // 진짜 에러 발생했넴

      // expect(result).resolves.toEqual(testOrm);
    });

    it('should create TestOrm', async () => {
      repository.save.mockResolvedValue(createArgs); // 성공할꺼라고 가정한다.
      const result = await service.create(createArgs); //

      expect(repository.save).toHaveBeenCalledTimes(1); // save가 1번 불러졌니?
      expect(repository.save).toHaveBeenCalledWith(createArgs); // 매개변수로 createArgs가 주어졌니?

      expect(result).toEqual(createArgs); // 이 create() method의 결과가 `createArgs`와 똑같니?
    });
  });

  describe('findAll()', () => {
    it('should be find All', async () => {
      repository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledTimes(1);

      expect(result).toEqual([]);
    });

    it('should fail on exception', async () => {
      repository.find.mockRejectedValue('find error');

      const result = await service.findAll();

      expect(result).toEqual('find error');
    });
  });

  describe('findOne()', () => {
    const findOneArgs = { id: 1 };

    it('should be findOne', async () => {
      const mockedPost = {
        id: '1',
        name: '이름',
        version: '버젼...',
      };
      repository.findOne.mockResolvedValue(mockedPost);

      const result = await service.findOne(findOneArgs.id);

      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith(findOneArgs);

      expect(result).toEqual(mockedPost);
    });

    it('should fail if no post is found', async () => {
      repository.findOne.mockResolvedValue(null);

      const result = await service.findOne(findOneArgs.id);

      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith(findOneArgs);

      expect(result).toEqual(new EntityNotFoundError(TestOrm, findOneArgs.id));
    });

    it('should fail on findOne exception', async () => {
      repository.findOne.mockRejectedValue('find error');

      const result = await service.findOne(findOneArgs.id);

      expect(result).toEqual('find error');
    });

    // ext
    it('should get a single user', () => {
      const oneUser = {
        name: 'firstName #1',
        version: 'lastName #1',
      };

      const repoSpy = jest.spyOn(repository, 'findOneBy');

      expect(service.findOne(1)).resolves.toEqual(oneUser);

      expect(repoSpy).toBeCalledWith({ id: 1 });
    });
  });

  describe('update()', () => {
    const findOneArgs = { id: 1 };
    const updateArgs = {
      name: 'new',
      version: 'new_version',
    };

    it('should be update post', async () => {
      const oldTestOrm = {
        id: 1,
        name: 'old',
        version: 'version description',
      };
      const newTestOrm = {
        id: 1,
        name: 'new',
        version: 'version description',
      };

      repository.findOne.mockResolvedValue(oldTestOrm);
      repository.save.mockResolvedValue(newTestOrm);

      const result = await service.update(findOneArgs.id, updateArgs);

      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith(findOneArgs);

      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith({
        ...oldTestOrm,
        ...updateArgs,
      });

      expect(result).toEqual(newTestOrm);
    });

    it('should fail if no post is found', async () => {
      repository.findOne.mockResolvedValue(null);

      const result = await service.findOne(findOneArgs.id);

      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith(findOneArgs);

      expect(result).toEqual(new EntityNotFoundError(TestOrm, findOneArgs.id));
    });

    it('should fail on findOne exception', async () => {
      repository.findOne.mockRejectedValue('find error');

      const result = await service.findOne(findOneArgs.id);

      expect(result).toEqual('find error');
    });

    it('should fail on save exception', async () => {
      repository.save.mockResolvedValue('find error');

      const result = await service.update(findOneArgs.id, updateArgs);

      expect(result).toEqual('find error');
    });
  });

  describe('remove()', () => {
    const removeArgs = 1;
    const findOneArgs = { id: 1 };
    const softDeleteArgs = { id: 1 };

    it('should be remove post', async () => {
      repository.findOne.mockResolvedValue(findOneArgs);
      repository.softDelete.mockResolvedValue(softDeleteArgs);

      await service.remove(removeArgs);

      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith(findOneArgs);

      expect(repository.softDelete).toHaveBeenCalledTimes(1);
      expect(repository.softDelete).toHaveBeenCalledWith(softDeleteArgs);
    });

    it('should fail if no post is found', async () => {
      repository.findOne.mockResolvedValue(null);

      const result = await service.remove(findOneArgs.id);

      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith(findOneArgs);

      expect(result).toEqual(new EntityNotFoundError(TestOrm, findOneArgs.id));
    });

    it('should fail on findOne exception', async () => {
      repository.findOne.mockRejectedValue('find error');

      const result = await service.findOne(findOneArgs.id);

      expect(result).toEqual('find error');
    });

    it('should fail on remove exception', async () => {
      repository.findOne.mockRejectedValue('remove error');

      const result = await service.findOne(findOneArgs.id);

      expect(result).toEqual('remove error');
    });

    // ext
    it('should call remove with the passed value', async () => {
      const removeSpy = jest.spyOn(repository, 'delete');
      const retVal = await service.remove(2);
      expect(removeSpy).toBeCalledWith(2);
      expect(retVal).toBeUndefined();
    });
  });

  // 함수 정의 하여 테스트
  describe('findOne() extend', () => {
    it('should return one user who has id in input param', async () => {
      const userId = 42;

      const result = await service.findOneById(userId);

      expect(result.id).toBe(userId);
    });

    it('should return InternelServerException when input userId is 1', async () => {
      const userId = 1;

      await expect(service.findOneById(userId)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});

// describe('TestOrmService', () => {
//   let service: TestOrmService;
//   let repository: Repository<TestOrm>;

//   beforeEach(async () => {
//     // initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

//     const module: TestingModule = await Test.createTestingModule({
//       // imports: [AppModule],
//       //   ConfigModule.forRoot({
//       //     isGlobal: true,
//       //     load: [config],
//       //     envFilePath: `.env`,
//       //   }),
//       //   DatabaseModule,
//       //   TypeOrmModule.forFeature([TestOrm, Chat]),
//       // ],
//       // providers: [
//       //   TestOrmService,
//       //   {
//       //     provide: getRepositoryToken(TestOrm),
//       //     useValue: {
//       //       find: jest.fn().mockResolvedValue(testOrmArray),
//       //       findOneBy: jest.fn().mockResolvedValue(oneTestOrm),
//       //       save: jest.fn().mockResolvedValue(oneTestOrm),
//       //       remove: jest.fn(),
//       //       delete: jest.fn(),
//       //     },
//       //   },
//       //   ChatService,
//       // ],
//       providers: [TestOrmService],
//     }).compile();

//     service = module.get<TestOrmService>(TestOrmService);
//     repository = module.get<Repository<TestOrm>>(getRepositoryToken(TestOrm));
//   });

// it('should be defined', () => {
//   expect(service).toBeDefined();
// });

/*
  beforeEach(async () => {
    initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

    // const module: TestingModule = await Test.createTestingModule({
    //   providers: [TestOrmService],
    // }).compile();

    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<TestOrmService>(TestOrmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should successfully insert a user', () => {
      const testOrm: TestOrm = {
        id: 0,
        name: 'firstName #1',
        version: 'version #1',
      };

      expect(
        service.create({
          id: 0,
          name: 'firstName #1',
          version: 'version #1',
        }),
      ).resolves.toEqual(testOrm);
    });
  });
  */
// });
