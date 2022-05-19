import Blockchain from './models/blockchain';
import Block from './models/block';
import { DIFFICULTY } from './utils/constants';

console.log('hola');
const blockchain = new Blockchain();

for (let i = 0; i < 10; i++) {
  const block = new Block(
    '0x',
    'genesis_hash',
    new Date().getTime(),
    'Genesis block',
    0,
    DIFFICULTY,
  );
  blockchain.addBlock(block);
  console.log(block.toString());
}
