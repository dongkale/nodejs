import { Module, Logger, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { ChatGateway } from './chat/chat.gateway';
// import { WsChatGateWay } from './ws-chat/ws-chat.gateway';
import { LoggerMiddleware } from './common/logger/logger.middleware';
import { ConfigModule } from '@nestjs/config';
// import { DatabaseModule } from './modules/database.module';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { AppDB } from './appDB.entity';
import { TestOrmModule } from './test-orm/test-orm.module';
// import { TestOrmController } from './test-orm/test-orm.controller';
// import { TestOrm } from './test-orm/test-orm.entity';
import * as dotenv from 'dotenv';
// import { DataSource } from 'typeorm';
// import { addTransactionalDataSource } from 'typeorm-transactional';
// import { TestOrmService } from './test-orm/test-orm.service';
import { ChatModule } from './chat/chat.module';
// import { Chat } from './chat/chat.entity';
import { DatabaseModule } from './common_modules/database.module';
// import { WsChatService } from './ws-chat/ws-chat.service';
import { WsChatModule } from './ws-chat/ws-chat.module';

import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/tasks.module';

import config from './configs/config';

import { APP_INTERCEPTOR } from '@nestjs/core';
import { RequestLoggerInterceptor } from './interceptor/request-logger.interceptor';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      envFilePath: `.env`,
    }),
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: process.env.DB_HOST,
    //   port: parseInt(process.env.DB_PORT),
    //   username: process.env.DB_USERNAME,
    //   password: process.env.DB_PASSWORD,
    //   database: process.env.DB_NAME,
    //   entities: [AppDB, TestOrm],
    //   synchronize: true /* synchronize: true는 운영에서는 사용하지 마세요. */,
    // }),
    // TypeOrmModule.forRootAsync({
    //   useFactory(configService: ConfigService) {
    //     return {
    //       type: 'mysql',
    //       host: configService.get<string>('DB_HOST'), // process.env.DB_HOST,
    //       port: configService.get<number>('DB_PORT'), // parseInt(process.env.DB_PORT),
    //       username: configService.get<string>('DB_USERNAME'), // process.env.DB_USERNAME,
    //       password: configService.get<string>('DB_PASSWORD'), // process.env.DB_PASSWORD,
    //       database: configService.get<string>('DB_NAME'), // process.env.DB_NAME,
    //       entities: [TestOrm, Chat],
    //       synchronize:
    //         true /* synchronize: true는 운영에서는 사용하지 마세요. */,
    //       logging: false,
    //     };
    //   },
    //   async dataSourceFactory(options) {
    //     if (!options) {
    //       throw new Error('Invalid options passed');
    //     }

    //     return addTransactionalDataSource(new DataSource(options));
    //   },
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    // }),
    // TypeOrmModule.forFeature([AppDB, TestOrm]),
    ScheduleModule.forRoot(),
    TasksModule,
    DatabaseModule,
    TestOrmModule,
    ChatModule,
    WsChatModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: RequestLoggerInterceptor,
    // },
    Logger,
  ],
})
export class AppModule {
  // let's add a middleware on all routes
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
