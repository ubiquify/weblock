# @ubiquify/weblock

Block store for the browser.

## API

```ts
export interface BrowserBlockStore {
  get: (cid: any) => Promise<Uint8Array>;
  put: (block: { cid: any; bytes: Uint8Array }) => Promise<void>;
  clear: () => Promise<void>;
  cids: () => Promise<string[]>;
}
```

## Usage

```ts
import { BrowserBlockStore } from "@ubiquify/weblock";
const block = {
  cid: "bafybeib4q7gk2q7b2j2z6x5qz2x3m7k4q6v5z2j2z3m7k4q6v5z2j2z",
  bytes: new Uint8Array([1, 2, 3]),
};
const blockStore: BrowserBlockStore = blockStoreFactory({});
await blockStore.put(block);
const bytes = await blockStore.get(block.cid);
```

## Build

```sh
npm run clean
npm install
npm run build
```

## Test

```sh
npm run test
```

## Licenses

Licensed under either [Apache 2.0](http://opensource.org/licenses/MIT) or [MIT](http://opensource.org/licenses/MIT) at your option.
