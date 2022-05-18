import { SHA256 } from 'crypto-js';
import hex2ascii from 'hex2ascii';
import { DIFFICULTY, MINE_RATE } from 'utils/constants';

class Block implements IBlock {
  public hash: string;
  public previousHash: string;
  public time: number;
  public data: string;
  public nonce: number;
  public difficulty: number;
  public body: string; // ver
  public height: number; // ver

  constructor(
    hash: string,
    previuosHash: string,
    time: number,
    data: Payload,
    nonce: number,
    difficulty: number,
  ) {
    this.hash = hash;
    this.previousHash = previuosHash;
    this.time = time;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty;
    this.body = JSON.stringify(data).toString(); // ver
    this.height = 0; // ver
  }

  get genesis(): IBlock {
    const time = new Date('2009-03-01').getTime();
    return new Block('0x', 'genesis_hash', time, 'Genesis block', 0, DIFFICULTY);
  }

  mine(previousBlock: PreviousBlock, data: Payload): IBlock {
    const { hash: previousHash } = previousBlock;
    let { difficulty } = previousBlock;
    let hash;
    let time;
    let nonce = 0;

    do {
      time = Date.now();
      nonce = +1;
      difficulty = previousBlock.time + MINE_RATE > time ? difficulty + 1 : difficulty - 1;
      hash = SHA256(`${previousHash}${time}${data}${nonce}${difficulty}`).toString();
    } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

    return new Block(previousHash, hash, data, time, nonce, difficulty);
  }

  validate(): Promise<boolean> {
    const self = this;
    return new Promise((resolve) => {
      let currentHash = self.hash;

      self.hash = SHA256(JSON.stringify({ ...self, hash: null })).toString();

      if (currentHash !== self.hash) {
        return resolve(false);
      }

      resolve(true);
    });
  }

  getBlockData(): Payload {
    const self = this;
    return new Promise((resolve, reject) => {
      let encodedData = self.body;
      let decodedData = hex2ascii(encodedData);
      let dataObject = JSON.parse(decodedData);

      if (dataObject === 'Genesis Block') {
        reject(new Error('This is the Genesis Block'));
      }

      resolve(dataObject);
    });
  }

  toString(): string {
    const { hash, previousHash, time, data, nonce, difficulty } = this;
    return `🧱 Block -
    Time: ${time}
    Previous Hash: ${previousHash}
    Hash: ${hash}
    Data: ${data}
    Nonce: ${nonce}
    Difficulty: ${difficulty}
    -------------------------------------`;
  }
}

export default Block;
