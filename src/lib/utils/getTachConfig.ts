import tc from 'tach.config';
import { ITachConfiguration } from '@/lib/abstractions';
// @ts-ignore
let tcLocal = require('tach.config.local');

if (!tcLocal) tcLocal = {};

export function getTachConfig(): ITachConfiguration {
  return Object.keys(tcLocal).length === 0 ? tc : tcLocal;
}
