import "fake-indexeddb/auto";
import { BrowserBlockStore, blockStoreFactory } from "../index.js";

describe("BlockStore", () => {
  it("should store and retrieve blocks", async () => {
    const block = {
      cid: { toString: () => "cid" },
      bytes: new Uint8Array([1, 2, 3]),
    };
    const blockStore: BrowserBlockStore = blockStoreFactory({});
    await blockStore.put(block);
    const bytes = await blockStore.get(block.cid);
    expect(bytes).toEqual(block.bytes);
    await blockStore.clear();
  });
  it("should store and retrieve blocks with a custom codec", async () => {
    const block = {
      cid: {
        index: `${Math.random()}`,
        toString: () => {
          throw new Error("should not be called");
        },
      },
      bytes: new Uint8Array([1, 2, 3]),
    };
    const encode = (cid: any) => `prefix-${cid.index}`;
    const blockStore: BrowserBlockStore = blockStoreFactory({ encode });
    await blockStore.put(block);
    const bytes = await blockStore.get(block.cid);
    expect(bytes).toEqual(block.bytes);
    await blockStore.clear();
  });

  it("should store and retrieve blocks with a cache", async () => {
    const block = {
      cid: { toString: () => "cid" },
      bytes: new Uint8Array([1, 2, 3]),
    };
    const cache = {};
    const blockStore: BrowserBlockStore = blockStoreFactory({ cache });
    await blockStore.put(block);
    const bytes = await blockStore.get(block.cid);
    expect(bytes).toEqual(block.bytes);
    expect(cache).toEqual({ cid: block.bytes });
    await blockStore.clear();
  });

  it("should store and retrieve blocks with a cache and a custom codec", async () => {
    const block = {
      cid: {
        index: `${Math.random()}`,
        toString: () => {
          throw new Error("should not be called");
        },
      },
      bytes: new Uint8Array([1, 2, 3]),
    };
    const encode = (cid: any) => `prefix-${cid.index}`;
    const cache = {};
    const blockStore: BrowserBlockStore = blockStoreFactory({ cache, encode });
    await blockStore.put(block);
    const bytes = await blockStore.get(block.cid);
    const key = encode(block.cid);
    expect(bytes).toEqual(block.bytes);
    expect(cache).toEqual({ [key]: block.bytes });
    await blockStore.clear();
  });

  it("should throw if block not found", async () => {
    const blockStore = blockStoreFactory({});
    const cid = { toString: () => "cid" };
    await expect(blockStore.get(cid)).rejects.toThrow(
      `BlockNotFound: ${cid.toString()}`
    );
    await blockStore.clear();
  });

  it("should throw if block not found with cache", async () => {
    const cache = {};
    const blockStore = blockStoreFactory({ cache });
    const cid = { toString: () => "cid" };
    await expect(blockStore.get(cid)).rejects.toThrow(
      `BlockNotFound: ${cid.toString()}`
    );
    expect(cache).toEqual({});
    await blockStore.clear();
  });
  
  it("should return cid list", async () => {
    const blockStore = blockStoreFactory({});
    const cid = { toString: () => "cid" };
    await blockStore.put({ cid, bytes: new Uint8Array([1, 2, 3]) });
    const cids = await blockStore.cids();
    expect(cids).toEqual([cid.toString()]);
    await blockStore.clear();
  });
});
