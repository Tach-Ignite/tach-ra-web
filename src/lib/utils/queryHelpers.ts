import {
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from '@reduxjs/toolkit/dist/query';

export type QueryReturnValue<T> =
  | {
      error: FetchBaseQueryError;
      data?: undefined;
      meta?: FetchBaseQueryMeta;
    }
  | {
      error?: undefined;
      data: T;
      meta?: FetchBaseQueryMeta;
    };

export function getFormData<T>(
  entity: T,
  fileProperties: Array<string>,
): FormData {
  const data = new FormData();
  Object.entries(entity as any).forEach(([key, value]) => {
    if (!fileProperties.includes(key)) {
      if (typeof value === 'object') {
        data.append(key, JSON.stringify(value));
      } else {
        data.append(key, value as string | Blob);
      }
    } else {
      data.append(key, ((entity as any)[key] as FileList)[0]);
    }
  });

  return data;
}

export function getFileProperties<T>(entity: T): Array<string> {
  const fileProperties: Array<string> = [];
  Object.entries(entity as any).forEach(([key, value]) => {
    if (value instanceof FileList) {
      fileProperties.push(key);
    }
  });

  return fileProperties;
}
