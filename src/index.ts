/*
 * @Author: WeijianXu weijian.xu@unidt.com
 * @Date: 2024-04-17 15:15:45
 * @LastEditors: WeijianXu weijian.xu@unidt.com
 * @LastEditTime: 2024-04-23 11:54:05
 * @FilePath: \output-verbatim\src\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { VerbatimText, VerbatimOptions } from '../types/index.d';

export function splitRichText(str: VerbatimText): Array<string | string[]> {
  // 匹配任意的HTML标签及其内容
  const regex = /(<[^>]+>)|([^<]+)/g;
  let result = `${str}`.match(regex) || [];

  // 优化结果，将连续的文本合并为一个数组项
  let optimizedResult = [];
  let tagStack = [];
  for (let i = 0; i < result.length; i++) {
    const isStartTag = result[i].startsWith('<') && !result[i].startsWith('</');
    const isEmptyTag = result[i].startsWith('<') && result[i].startsWith('/>');
    const isEndTag = result[i].startsWith('</') && result[i].endsWith('>');

    if (isEmptyTag) {
      optimizedResult.push(result[i]);
    } else if (isStartTag) {
      tagStack.push(result[i]);
    } else if (isEndTag) {
      // 取出标签名称
      const tagName = result[i].substring(2, result[i].length - 1);

      // 需要与栈顶元素匹配
      const isSameTag = tagStack[0].indexOf('<' + tagName) == 0;
      // console.log('tagName', tagName, isSameTag);
      tagStack.push(result[i]);
      // 本次匹配结束
      if (isSameTag) {
        optimizedResult.push(tagStack);
        // 重置栈
        tagStack = [];
      }
    } else {
      // 文本
      if (tagStack.length) {
        tagStack.push(result[i]);
      } else {
        optimizedResult.push(result[i]);
      }
    }
  }
  return optimizedResult;
}

function getCurrStepInfo(currStepStr: string | string[]) {
  let text = '';
  let start = '';
  let end = '';
  if (Array.isArray(currStepStr)) {
    // 当前步长为数组，打印富文本
    // 富文本数组收尾是标签，如： ['<b>', '加粗', '</b>'] 、 ['<br/>']、 ['<i>', '</i>']
    // TODO 暂不支持嵌套标签， 如： ['<b>', '加粗', '<i>', '斜体', '</i>' '</b>']
    start = currStepStr[0];
    if (currStepStr.length >= 2) {
      end = currStepStr[currStepStr.length - 1];
      text = currStepStr.slice(1, currStepStr.length - 1).join('');
    } else {
      text = '';
    }
  } else {
    text = currStepStr;
  }
  return { start, text, end };
}

export default class VerbatimOutput {

  richText = '';

  options: VerbatimOptions = {
    speed: 30,
    start: 0,
  };

  _intervalId = 0;

  constructor(text: VerbatimText, options: VerbatimOptions) {
    this.richText = `${text}`;
    this.options = { ...this.options, ...options };
    if (options.before) {
      options.before();
    }
    this.outputRichText(this.richText, options);
  }

  outputRichText(text: string, opts: VerbatimOptions = {}) {
    const options = { ...this.options, ...opts };
    let richText = text;
    // 先打印起始文本
    let preText = '';
    if (options.start && options.start >= 0) {
      preText = text.substring(0, options.start);
      richText = text.substring(options.start);
      options.eachRound && options.eachRound(preText, '');
    }

    if (!richText) {
      // console.error('No input text');
      return;
    }
    const strList = splitRichText(richText) || [];
    // let index = 0; // 打印游标
    let step = 0; // 打印步长
    let stepIdx = 0; // 当前步长游标
    let round = 0; // 当前周期循环次数

    let stepInfo = getCurrStepInfo(strList[step]);

    let currText = preText + stepInfo.start; // 当前打印文本
    let currStepStr = stepInfo.text;

    this._intervalId = setInterval(() => {
      if (step >= strList.length) {
        clearInterval(this._intervalId);
        if (options.complete) {
          options.complete();
        }
        return;
      }
      // console.log('currStepStr', currStepStr);

      if (stepIdx < currStepStr.length) {
        currText += currStepStr[stepIdx].replace(/\n/g, '<br>');
        // index++;
        stepIdx++;
        round++;
        // 当前轮次下的打印文本


        if (options.eachRound) {
          // console.log('currText', currText, 'round', round, 'stepIdx', stepIdx, 'step', step);
          options.eachRound(currText + stepInfo.end, currStepStr);
        }
      } else {
        // 本步长结束
        step++;
        stepIdx = 0;
        // 将本轮的结束标签加上
        currText += stepInfo.end;
        // 开始新的一轮
        stepInfo = getCurrStepInfo(strList[step]);
        currStepStr = stepInfo.text;
        currText += stepInfo.start; // 先加上开始标签，输出时加上结束标签
      }
    }, options.speed || 30) as unknown as number;
  }

  stop() {
    clearInterval(this._intervalId);
  }
}
