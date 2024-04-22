/*
 * @Author: WeijianXu weijian.xu@unidt.com
 * @Date: 2024-04-22 11:56:33
 * @LastEditors: WeijianXu weijian.xu@unidt.com
 * @LastEditTime: 2024-04-22 11:58:13
 * @FilePath: \output-verbatimd:\app\me\webpack-plugin-jszip\test\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

const path = require('path');
const Mocha = require('mocha');

const mocha = new Mocha({
  timeout: '10000ms'
});

console.log('Begin to run test');

mocha.addFile(path.join(__dirname, 'verbatim.test.js'));

mocha.run();
