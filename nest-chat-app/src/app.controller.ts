import { Controller, Get, Logger, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { TestOrmService } from './test-orm/test-orm.service';

@Controller('/')
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
    private testOrmService: TestOrmService,
  ) {}

  @Get()
  getHome(): string {
    this.logger.log('Calling getHome()');

    return this.appService.getHome();
  }

  @Get('hello')
  getHello(): string {
    this.logger.log('Calling getHello()');

    return this.appService.getHello();
  }

  @Get('world')
  getWorld(): string {
    this.logger.log('Calling getWorld()');

    return this.appService.getWorld();
  }

  @Get('test')
  getTest(): string {
    this.logger.log('Calling getTest()');
    this.logger.debug('Calling getTest()');
    this.logger.warn('Calling getTest()');

    this.logger.log(`=== ${this.configService.get('LogLevel')}`);

    try {
      throw new Error();
    } catch (e) {
      this.logger.error('Calling getTest()', e.stack);
    }

    this.logger.log(`=== ${this.configService.get('NODE_ENV')}`);
    const arg = this.configService.get('APP_NAME');

    return this.appService.getTest(arg);
  }

  // @Get('data')
  // async getData(): Promise<AppDB[]> {
  //   this.logger.log('Calling getData()');

  //   const v = await this.appService.findAll();
  //   // v.for

  //   v.forEach((e: AppDB) => {
  //     this.logger.log(`id: ${e.id} name: ${e.name}`);
  //   });

  //   return await this.appService.findAll();

  //   // json 형태로 변환
  //   // return await v.then((e: AppDB[]) => {
  //   //   return JSON.stringify(e);
  //   // });
  //   // const v2 = (await v).forEach((e: AppDB) => {  // forEach는 return이 없음.
  //   //   this.logger.log(e.id);
  //   // }

  //   // return (await v).toString();
  // }

  // @Get('findAll')
  // async findAll(): Promise<AppDB[]> {
  //   return await this.appService.findAll();
  // }

  // @Get('findOne/:id')
  // async findOne(@Param('id') id: number): Promise<AppDB> {
  //   return await this.appService.findOne(id);
  // }

  @Get('query')
  query() {
    return this.testOrmService.query__();
  }
}
