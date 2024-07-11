import * as dotenv from 'dotenv';
// import { readFileSync } from 'fs';
// import * as yaml from 'js-yaml';
import common from './commonConf';
import dev from './devConf';
import prod from './prodConf';

dotenv.config();

const phase = process.env.NODE_ENV;

let conf = {};

conf = phase === 'prod' ? prod : dev;

export default () => ({
  ...common,
  ...conf,
});
