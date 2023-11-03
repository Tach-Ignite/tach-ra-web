import { FileLike } from '../viewModels';

export function fileLikeArrayToFileList(fileLikeArray: FileLike[]): FileList {
  function iterator(this: any) {
    let i = 0;
    const keys = Object.keys(this);
    return {
      next: () => {
        // The -1 is to account for our length property
        if (i >= Object.keys(this).length - 1) {
          i = 0;
          return {
            value: undefined,
            done: true,
          };
        }
        const val = {
          value: this[keys[i]],
          done: false,
        };
        i += 1;
        return val;
      },
    };
  }

  const result: any = {
    _list: [],
    [Symbol.iterator]: iterator,
    get length() {
      return this._list.length;
    },
    item(index: number) {
      return this._list[index];
    },
  };
  for (let i = 0; i < fileLikeArray.length; i++) {
    result[i] = fileLikeArray[i];
    result._list.push(fileLikeArray[i]);
  }

  return result as FileList;
}
