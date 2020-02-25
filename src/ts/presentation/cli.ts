import * as readline from 'readline';
import { red, underline } from 'colors/safe';
import { SequentParseError } from '../domain/error';
import { parse } from '../domain/parse';
import { prove } from '../domain/proof';
import { times } from '../util/text';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Input a sequent to prove.');
console.log('Type :q for quit');
rl.prompt();

rl.on('line', line => {
  const trimed = line.trim();
  if (trimed.length == 0) {
    rl.prompt();
    return;
  }
  if (trimed.startsWith(':')) {
    switch (line.trim()) {
      case ':q':
        rl.close();
        return;
      default:
        console.error('unknown command');
        console.log('Type :q for quit');
    }
    rl.prompt();
    return;
  }
  try {
    const s = parse(line);
    console.log();
    console.log(s.toString());
    const p = prove(s);
    if (p.provable) {
      console.log('This sequent is provable. The following is the proof figure.');
      console.log();
      console.log(p.figure!.toString());
      console.log();
    } else {
      console.log('This sequent is unprovable.');
    }
  } catch (e) {
    console.error(red(e.toString()));
    if (e instanceof SequentParseError) {
      if (line.length === e.position) {
        console.error(red(line));
      } else {
        console.error(red(line.slice(0, e.position) + underline(line[e.position]) + line.slice(e.position + 1)));
      }
      console.error(times(' ', e.position) + red('^'));
    } else {
      console.error(e);
    }
  }
  rl.prompt();
});
