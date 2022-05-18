interface IBlock {
  hash: string;
  previousHash: string;
  time: number;
  data: string;
  nonce: number;
  difficulty: number;
  body: string; // ver
  height: number; // ver

  get genesis(): IBlock;
  mine(previousBlock: PreviousBlock, data: Payload): IBlock;
  toString(): string;
  validate(): Promise<boolean>;
  getBlockData(): Payload;
}

interface IBlockchain {
  height: number;
  chain: IBlock[];

  validateChain(): Promise<boolean>;
  addBlock(block: IBlock): Promise<IBlock>;
  print(): void;
}

type PreviousBlock = {
  time: number;
  hash: string;
  difficulty: number;
};

type Payload = any;

declare module 'hex2ascii';
