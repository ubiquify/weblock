import {
  get as blockGet,
  set as blockSet,
  createStore,
  clear as blockClear,
  keys as blockKeys,
  entries as blockEntries,
} from "idb-keyval";

export interface BrowserBlockStore {
  get: (cid: any) => Promise<Uint8Array>;
  put: (block: { cid: any; bytes: Uint8Array }) => Promise<void>;
  clear: () => Promise<void>;
  cids: () => Promise<string[]>;
}

export const blockStoreFactory = ({
  cache,
  encode,
}: {
  cache?: any;
  encode?: (cid: any) => string;
}): BrowserBlockStore => {
  const blockStore = createStore("block-store", "block");
  const encodeMethod = encode || ((cid: any) => cid.toString());

  const put = async (block: { cid: any; bytes: Uint8Array }): Promise<void> => {
    if (cache) cache[encodeMethod(block.cid)] = block.bytes;
    await blockSet(encodeMethod(block.cid), block.bytes, blockStore);
  };

  const get = async (cid: any): Promise<Uint8Array> => {
    let bytes: Uint8Array | undefined;
    if (cache) bytes = cache[encodeMethod(cid)];
    if (!bytes) {
      bytes = await blockGet(encodeMethod(cid), blockStore);
      if (!bytes) throw new Error(`BlockNotFound: ${encodeMethod(cid)}`);
      if (cache) cache[encodeMethod(cid)] = bytes;
    }
    return bytes;
  };

  const clear = async () => {
    if (cache) {
      for (const key of Object.keys(cache)) {
        delete cache[key];
      }
    }
    await blockClear(blockStore);
  };

  const cids = async () => {
    const keys = await blockKeys(blockStore);
    return keys.map((key) => key.toString());
  };

  return { get, put, clear, cids };
};
