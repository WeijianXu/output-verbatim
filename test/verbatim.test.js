/*
 * @Author: WeijianXu weijian.xu@unidt.com
 * @Date: 2024-04-22 17:45:54
 * @LastEditors: WeijianXu weijian.xu@unidt.com
 * @LastEditTime: 2024-04-22 18:28:24
 * @FilePath: \output-verbatim\test.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const Verbatim = require('../dist/output-verbatim.cjs').default;

describe('Checking output verbatim', () => {
  it('should output correctly', (done) => {
    
    let currT = '';
    let round = 0;
    const output = new Verbatim('<b>H</b>ello, <b>W</b>orld!  <b>T</b>he <b>I</b>s <b>O</b>utput <b>V</b>erbatim.', {
      speed: 30, // Printing speed per word, 30 milliseconds a word, a cycle
      // Output one word per cycle, rich text will contain labels
      eachRound: function (currText) {
        ++round;
        console.log(currText);
        currT = currText;
      },
      start: ('<b>H</b>ello, ').length
    })

    setTimeout(() => {
      output.stop();
      const o = {
        3: '<b>W</b>or',
        4: '<b>W</b>orl',
        5: '<b>W</b>orld',
      }
      if (o[round]) {
        done();
      }
      else {
        throw new Error('output is not correct');
      }
    }, 30 * 6 + 10);
  });
});
