import { parse } from '../domain/parse';
import { ProofTree, prove } from '../domain/proof';

const showFigure: (figure: ProofTree) => void = (figure: ProofTree) => {
  const figureArea = document.getElementById('proof-figure-area') as HTMLTextAreaElement;
  figureArea.value = figure.toString();
  figureArea.rows = figure.height << 1;
  document.getElementById('proof-figure')!.classList.remove('is-hidden');
};

const hideFigure: () => void = () => {
  document.getElementById('proof-figure')!.classList.add('is-hidden');
  const figureArea = document.getElementById('proof-figure-area') as HTMLTextAreaElement;
  figureArea.value = '';
};

const showError: (text: string, target: HTMLElement) => void = (text: string, target: HTMLElement) => {
  const message = document.getElementById('message')!;
  message.querySelector('.message-body')!.textContent = text;
  message.classList.remove('is-hidden');
  target.classList.add('is-danger');
};

const hideError: () => void = () => {
  const message = document.getElementById('message')!;
  message.querySelector('.message-body')!.textContent = '';
  message.classList.add('is-hidden');
  document.querySelectorAll('textarea.is-danger').forEach((e) => {
    e.classList.remove('is-danger');
  });
};

document.getElementById('btn-prove')!.addEventListener(
  'click',
  () => {
    hideFigure();
    hideError();
    const sequentArea = document.getElementById('sequent-area') as HTMLTextAreaElement;
    const sequentText = sequentArea.value;
    if (sequentText.trim().length === 0) {
      showError('式を入力して下さい。', sequentArea);
      return;
    }
    try {
      const proof = prove(parse(sequentText));
      if (proof.provable) {
        showFigure(proof.figure!);
      } else {
        showError('証明不可能な式です。', sequentArea);
      }
    } catch (e) {
      showError(e.message, sequentArea);
    }
  },
  false
);

document.getElementById('btn-clear')!.addEventListener(
  'click',
  () => {
    hideFigure();
    hideError();
    const sequentArea = document.getElementById('sequent-area') as HTMLTextAreaElement;
    sequentArea.value = '';
  },
  false
);
