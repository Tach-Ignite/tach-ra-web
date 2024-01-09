import tc from 'tach.config';

export function getTachConfig() {
  try {
    if (process.env.TACH_IGNORE_LOCAL_TACH_CONFIG === 'true') return tc;

    // @ts-ignore
    // eslint-disable-next-line global-require
    const tcLocal = require('tach.config.local');
    if (!tcLocal || Object.keys(tcLocal).length === 0) return tc;
    return tcLocal;
  } catch (error) {
    return tc;
  }
}
