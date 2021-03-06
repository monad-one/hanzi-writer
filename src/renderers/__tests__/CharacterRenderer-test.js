const ren = require('hanzi-writer-data/人.json');
const CharacterRenderer = require('../CharacterRenderer');
const svg = require('../../svg');
const { copyAndMergeDeep } = require('../../utils');
const CharDataParser = require('../../CharDataParser');


const char = new CharDataParser().generateCharacter('人', ren);

describe('CharacterRenderer', () => {

  let canvas;

  beforeEach(() => {
    document.body.innerHTML = '<div id="target"></div>';
    canvas = svg.Canvas.init('target');
  });

  it('renders a g element and puts strokes inside', () => {
    const props = {
      strokeColor: {r: 120, g: 17, b: 101, a: 0.3},
      radicalColor: null,
      strokeWidth: 2,
      opacity: 0.7,
      strokes: {
        0: {
          opacity: 1,
          displayPortion: 1,
        },
        1: {
          opacity: 1,
          displayPortion: 1,
        },
      },
    };

    const charRenderer = new CharacterRenderer(char);
    charRenderer.mount(canvas);
    charRenderer.render(props);

    const subCanvas = canvas.svg.childNodes[1];
    expect(subCanvas.nodeName).toBe('g');
    expect(subCanvas.style.opacity).toBe('0.7');
    // 2 strokes of 人
    expect(subCanvas.childNodes.length).toBe(2);
    subCanvas.childNodes.forEach(node => {
      expect(node.nodeName).toBe('path');
      expect(node.getAttribute('stroke')).toBe('rgba(120,17,101,0.3)');
    });
  });

  it('updates opacity and updates passed-through props', () => {
    const props1 = {
      strokeColor: {r: 120, g: 17, b: 101, a: 0.3},
      radicalColor: null,
      strokeWidth: 2,
      opacity: 0.7,
      strokes: {
        0: {
          opacity: 1,
          displayPortion: 1,
        },
        1: {
          opacity: 1,
          displayPortion: 1,
        },
      },
    };

    const props2 = copyAndMergeDeep(props1, {
      strokeColor: {r: 255, g: 255, b: 0, a: 0.1},
      opacity: 0.9,
    });

    const charRenderer = new CharacterRenderer(char);
    charRenderer.mount(canvas);
    charRenderer.render(props1);
    charRenderer.render(props2);


    const subCanvas = canvas.svg.childNodes[1];
    expect(subCanvas.nodeName).toBe('g');
    expect(subCanvas.style.opacity).toBe('0.9');
    // 2 strokes of 人
    expect(subCanvas.childNodes.length).toBe(2);
    subCanvas.childNodes.forEach(node => {
      expect(node.nodeName).toBe('path');
      expect(node.getAttribute('stroke')).toBe('rgba(255,255,0,0.1)');
    });
  });

  it('sets display: none if opacity is 0', () => {
    const props1 = {
      strokeColor: {r: 101, g: 101, b: 101, a: 1},
      radicalColor: null,
      strokeWidth: 2,
      opacity: 0,
      strokes: {
        0: {
          opacity: 1,
          displayPortion: 1,
        },
        1: {
          opacity: 1,
          displayPortion: 1,
        },
      },
    };

    const props2 = copyAndMergeDeep(props1, {
      strokeColor: {r: 255, g: 255, b: 0, a: 0.1},
      opacity: 0.9,
    });

    const charRenderer = new CharacterRenderer(char);
    charRenderer.mount(canvas);
    charRenderer.render(props1);
    const subCanvas = canvas.svg.childNodes[1];

    expect(subCanvas.style.opacity).toBe('0');
    expect(subCanvas.style.display).toBe('none');

    charRenderer.render(props2);

    expect(subCanvas.style.opacity).toBe('0.9');
    expect(subCanvas.style.display).toBe('initial');
  });

});
