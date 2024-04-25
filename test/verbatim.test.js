/*
 * @Author: WeijianXu weijian.xu@unidt.com
 * @Date: 2024-04-22 17:45:54
 * @LastEditors: WeijianXu weijian.xu@unidt.com
 * @LastEditTime: 2024-04-25 17:24:24
 * @FilePath: \output-verbatim\test.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const Verbatim = require('../dist/output-verbatim.cjs').default;

describe('Checking output verbatim', () => {
  it('should output correctly', (done) => {
    
    let round = 0;
    const output = new Verbatim('<b>H</b>ello, <b>W</b>orld!  <b>T</b>he <b>I</b>s <b>O</b>utput <b>V</b>erbatim.', {
      speed: 30, // Printing speed per word, 30 milliseconds a word, a cycle
      // Output one word per cycle, rich text will contain labels
      eachRound:  (currText) => {
        ++round;
        if (round === 5) {
          console.log(currText);
          output.stop();
          if (currText === '<b>H</b>ello, <b>W</b>orld') {
            done();
          } else {
            throw new Error('output is not correct');
          }
        }
      },
      start: ('<b>H</b>ello, ').length
    });
  });

  it('should transfer markdow content correctly', (done) => {
    let round = 0;
    const output = new Verbatim('# Output Verbatim\n<b>H</b>ello, <b>W</b>orld!  <b>T</b>he <b>I</b>s <b>O</b>utput <b>V</b>erbatim.', {
      speed: 30, // Printing speed per word, 30 milliseconds a word, a cycle
      // Output one word per cycle, rich text will contain labels
      eachRound:  (currText) => {
        ++round;
        if (round === 1) {
          console.log(currText);
          output.stop();
          if (currText === '<h1>O</h1>') {
            done();
          } else {
            throw new Error('Transfering markdown to html is not correct');
          }
        }
      },
      markdown: true,
    });
  });

  it('should frequent call correctly', (done) => {
    let output = null;
    let timer = null;
    const verbatimOutput = (text, start) => {
      // chartText.value = '';
      // Stop previous output
      output && output.stop();
      let round = 0;
      output = new Verbatim(text, {
        speed: 30,
        start: start >= 0 ? start : 0,
        // before: (preText) => {
          // chartText.value = preText;
        // },
        eachRound: (currText) => {
          // console.log(currText);
          ++round;
          if (start === 5 && round === 5) {
            console.log(currText);
            output.stop();
            clearInterval(timer);
            if (currText === '<p>0000011111</p>') {
              done();
            } else {
              throw new Error('Frequent call correctly is not correct');
            }
          }
        },
        // complete: (finalText) => {
          // chartText.value = finalText;
        // },
        markdown: true,
      });
    };
    
    // mock async call
    let index = 0;
    let content = '';
    timer = setInterval(() => {
      const start = content.length || 0;
      content = content + Array(5).fill(index).join('');
      // console.log(content);
      verbatimOutput(content, start);
      ++index;
      if (index > 3) {
        clearInterval(timer);
        output && output.stop();
      }
    }, 30 * 6 + 20);
  })
});
