import { SHA256 } from 'crypto-js';
import Block from './block';
import { DIFFICULTY } from 'utils/constants';

class Blockchain implements IBlockchain {
  public height: number;
  public chain: IBlock[];

  constructor() {
    this.chain = [];
    this.height = -1;
    this.initializeChain();
  }

  async initializeChain() {
    if (this.height === -1) {
      const time = new Date('2009-03-01').getTime();

      const block = new Block('0x', 'genesis_hash', time, 'Genesis block', 0, DIFFICULTY);
      await this.addBlock(block);
    }
  }

  addBlock(block: IBlock): Promise<IBlock> {
    let self = this;

    return new Promise(async (resolve, reject) => {
      block.height = self.chain.length;
      block.time = new Date().getTime();

      if (self.chain.length > 0) {
        block.previousHash = self.chain[self.chain.length - 1].hash;
      }

      let errors = await self.validateChain();
      if (errors.length > 0) {
        reject(new Error('The chain is not valid: ', errors));
      }

      block.hash = SHA256(JSON.stringify(block)).toString();
      self.chain.push(block);
      resolve(block);
    });
  }

  validateChain(): Promise<any> {
    let self = this;
    const errors: any = [];

    return new Promise(async (resolve, reject) => {
      self.chain.map(async (block) => {
        try {
          let isValid = await block.validate();
          if (!isValid) {
            errors.push(new Error(`The block ${block.height} is not valid`));
          }
        } catch (err) {
          errors.push(err);
        }
      });

      resolve(errors);
    });
  }

  print() {
    let self = this;
    for (let block of self.chain) {
      console.log(block.toString());
    }
  }
}

export default Blockchain;
