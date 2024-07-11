import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { WinstonModule, utilities } from 'nest-winston';
import * as winston from 'winston';
import * as winstonDaily from 'winston-daily-rotate-file';

//const configService = app.get(ConfigService);
// const port = ConfigService.get<int>('PORT');

/*
const dailyOption = (appName: string, level: string) => {
  return {
    level,
    datePattern: 'YYYY-MM-DD',
    // dirname: `./logs/${level}`,
    // filename: `logs/%DATE%.${level}.log`,
    filename: `logs/${appName}.%DATE%.log`,
    maxFiles: 30,
    zippedArchive: false,
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      winston.format.errors({ stack: false }),
      // winston.format.cli(),
      // winston.format.splat(),
      // winston.format.timestamp(),
      // winston.format.uncolorize(),
      // winston.format.printf((info) => {
      //   return `[${info.timestamp}][${info.level}] ${info.message}`;
      // }),
      utilities.format.nestLike(appName, {
        colors: false,
        prettyPrint: true,
      }),
    ),

    // format: winston.format.combine(
    //   winston.format.timestamp(),
    //   utilities.format.nestLike(process.env.NODE_ENV, {
    //     colors: false,
    //     prettyPrint: true,
    //   }),
    // ),
  };
};
*/

// export const winstonLogger = WinstonModule.createLogger({
//   transports: [
//     new winstonDaily({
//       filename: `logs/${'appName'}.%DATE%.log`,
//       maxFiles: 30,
//       zippedArchive: false,
//       maxSize: '20m',
//       format: winston.format.combine(
//         winston.format.timestamp({
//           format: 'YYYY-MM-DD HH:mm:ss',
//         }),
//         winston.format.errors({ stack: false }),
//         // winston.format.cli(),
//         // winston.format.splat(),
//         // winston.format.timestamp(),
//         // winston.format.uncolorize(),
//         // winston.format.printf((info) => {
//         //   return `[${info.timestamp}][${info.level}] ${info.message}`;
//         // }),
//         utilities.format.nestLike('appName', {
//           colors: false,
//           prettyPrint: true,
//         }),
//       ),
//     }),
//     new winston.transports.Console({
//       level: 'info',
//       format: winston.format.combine(
//         winston.format.timestamp(),
//         utilities.format.nestLike(process.env.APP_NAME, {
//           colors: true,
//           prettyPrint: true,
//         }),
//       ),
//     }),
//     // new winstonDaily(dailyOption('info')),
//     // new winstonDaily(dailyOption('', 'debug')),
//     // new winstonDaily(dailyOption('', 'warn')),
//     // new winstonDaily(dailyOption('', 'error')),
//   ],
// });

// https://malgogi-developer.tistory.com/26
// https://lsmod.medium.com/nestjs-setting-up-file-logging-daily-rotation-with-winston-28147af56ec4
// https://timothy.hashnode.dev/advance-your-nestjs-application-with-winston-logger-a-step-by-step-guide

/*
function getCaller() {
  let err;
  try {
    throw Error('');
  } catch (e) {
    err = e;
  }
  const pattern = /\s*at (Object.)?(silly|debug|verbose|info|warn|error) /;
  const callerLine = err.stack
    .split('\n')
    .filter((line) => pattern.test(line))[0];
  if (!callerLine) {
    return '';
  }
  return callerLine.replace(pattern, '').replace(/^\(|\)$/g, '');
}
*/

export const winstonLogger = (appName: string) => {
  return WinstonModule.createLogger({
    level: 'silly',
    transports: [
      new winstonDaily({
        filename: `logs/${appName}.%DATE%.log`,
        maxFiles: 30,
        zippedArchive: false,
        maxSize: '20m',
        format: winston.format.combine(
          winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
          }),
          winston.format.errors({ stack: true }),
          winston.format.splat(),
          // winston.format.printf((info) => {
          //   const { timestamp, level, message, ...args } = info;
          //   const callModule = args.context ? args.context : '';

          //   const ts = timestamp.slice(0, 19).replace('T', ' ');
          //   return `${ts} [${level}]: ${message} ${
          //     Object.keys(args).length ? JSON.stringify(args, null, 2) : ''
          //   }`;
          // }),
          winston.format.printf((info) => {
            const { timestamp, level, message, stack, ...args } = info;

            const levelString = level.toUpperCase().padEnd(5);
            const stackString = stack ? '- ' + stack : '';
            const callModule = args.context ? '[' + args.context + ']' : '';

            return `[${timestamp}][${levelString}]${callModule} ${message} ${stackString}`;
          }),
          // utilities.format.nestLike(appName, {
          //   colors: false,
          //   prettyPrint: true,
          // }),
        ),
      }),
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          utilities.format.nestLike(appName, {
            colors: true,
            prettyPrint: true,
          }),
        ),
      }),
    ],
  });
};

//   logger: WinstonModule.createLogger({
//     transports: [
//       // // file on daily rotation (error only)
//       // new transports.DailyRotateFile({
//       //   // %DATE will be replaced by the current date
//       //   filename: `logs/%DATE%-error.log`,
//       //   level: 'error',
//       //   format: format.combine(
//       //     format.timestamp(),
//       //     format.cli(),
//       //     format.splat(),
//       //     format.timestamp(),
//       //     format.printf((info) => {
//       //       return `${info.timestamp} ${info.level}: ${info.message}`;
//       //     }),
//       //   ),
//       //   datePattern: 'YYYY-MM-DD',
//       //   zippedArchive: false, // don't want to zip our logs
//       //   maxFiles: '30d', // will keep log until they are older than 30 days
//       // }),
//       // same for all levels
//       new transports.DailyRotateFile({
//         filename: `logs/%DATE%.log`,
//         format: format.combine(
//           format.timestamp(),
//           format.cli(),
//           format.splat(),
//           format.timestamp(),
//           format.printf((info) => {
//             return `${info.timestamp} ${info.level}: ${info.message}`;
//           }),
//         ),
//         datePattern: 'YYYY-MM-DD',
//         zippedArchive: false,
//         maxSize: '20m',
//         maxFiles: '30d',
//       }),
//       new transports.Console({
//         format: format.combine(
//           format.cli(),
//           format.splat(),
//           format.timestamp(),
//           format.printf((info) => {
//             return `${info.timestamp} ${info.level}: ${info.message}`;
//           }),
//         ),
//       }),
//     ],
//   }),
