import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm'; // entity에 query날리는건 repository임.
// import { AppDB } from './appDB.entity';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  // @InjectRepository(AppDB) private appDBRepository: Repository<AppDB>,
  constructor(private readonly configService: ConfigService) {}

  // findAll(): Promise<AppDB[]> {
  //   return this.appDBRepository.find();
  // }

  // findOne(id: number): Promise<AppDB> {
  //   return this.appDBRepository
  //     .find({
  //       where: [{ id: id }],
  //     })
  //     .then((result) => result[0]);
  // }

  getHome(): string {
    this.logger.log('Service getHome()');
    return 'Home';
  }

  getHello(): string {
    this.logger.log('Service getHello()');
    return 'Hello !';
  }

  getWorld(): string {
    this.logger.log('Service getWorld()');
    return 'World!';
  }

  getTest(arg): string {
    this.logger.log(`Service getTest(${arg})`);

    return 'Test...! ' + arg;
  }

  // async getData(): Promise<AppDB[]> {
  //   this.logger.log('Service getData()');

  //   // const v = ;
  //   // const v = '';
  //   return this.findAll();
  // }
}
