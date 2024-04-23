/*
 * @Author: WeijianXu weijian.xu@unidt.com
 * @Date: 2024-04-17 15:15:45
 * @LastEditors: WeijianXu weijian.xu@unidt.com
 * @LastEditTime: 2024-04-23 18:42:09
 * @FilePath: \output-verbatim\src\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import markdownit from 'markdown-it';
import { VerbatimText, VerbatimOptions } from '../types/index.d';

export function splitRichText(str: VerbatimText): Array<string | string[]> {
  // 匹配任意的HTML标签及其内容
  const regex = /(<[^>]+>)|([^<]+)/g;
  let result = `${str}`.match(regex) || [];

  // 优化结果，将连续的文本合并为一个数组项
  let optimizedResult = [];
  let tagStack = [];
  for (let i = 0; i < result.length; i++) {
    const r = result[i];
    const isStartTag = r.startsWith('<') && !r.startsWith('</');
    const isEmptyTag = r.startsWith('<') && r.startsWith('/>');
    const isEndTag = r.startsWith('</') && r.endsWith('>');

    if (isEmptyTag) {
      optimizedResult.push(r);
    } else if (isStartTag) {
      tagStack.push(r);
    } else if (isEndTag) {
      // 取出标签名称
      const tagName = r.substring(2, r.length - 1);

      // 需要与栈顶元素匹配
      if (tagStack[0]) {
        const isSameTag = tagStack[0] ? tagStack[0].indexOf('<' + tagName) == 0 : false;
        // console.log('tagName', tagName, isSameTag);
        tagStack.push(r);
        // 本次匹配结束
        if (isSameTag) {
          optimizedResult.push(tagStack);
          // 重置栈
          tagStack = [];
        }
      }
      // </p> 没有对应的 <p> 标签，直接忽略
      // continue;
    } else {
      // 文本
      if (tagStack.length) {
        tagStack.push(r);
      } else {
        optimizedResult.push(r);
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

  rawText: VerbatimText = '';

  richText = '';

  options: VerbatimOptions = {
    speed: 30,
    start: 0,
    rich: true,
    markdown: false,
    endLineBreak: false,
  };

  _intervalId = 0;

  constructor(text: VerbatimText, options: VerbatimOptions) {
    this.rawText = text;
    this.options = { ...this.options, ...options };
    this.richText = this.handleRawText(text);
    if (options.before) {
      options.before();
    }
    this.outputRichText(this.richText, options);
  }

  handleRawText(text: VerbatimText) {
    // 处理换行符
    let richText = `${text}`.replace(/\n/g, '<br/>');
    // 处理Markdown语法
    if (this.options.markdown) {
      const md = markdownit({ html: true, xhtmlOut: true, linkify: true, breaks: true });
      richText = md.render(`${text}`, { hastNode: false }) as string;
    }
    // 处理结束换行符
    if (this.options.endLineBreak && (!richText.endsWith('<br/>') || !richText.endsWith('<br>'))) {
      richText = `${richText}<br/>`;
    } else {
      richText = richText.replace(/(<br\/?>|\n)$/, '');
    }
    return richText;
  }

  outputRichText(text: string, opts: VerbatimOptions = {}) {
    const options = { ...this.options, ...opts };
    let richText = text;
    // 先打印起始文本
    let preText = '';
    if (options.start && options.start >= 0) {
      preText = text.substring(0, options.start);
      richText = text.substring(options.start);
      // options.eachRound && options.eachRound(preText, '');
    }

    if (!richText) {
      // console.error('No input text');
      return;
    }
    // 富文本方式，还是原字符输出方式
    const strList = options.rich ? (splitRichText(richText) || []) : [richText];
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
          // 打印完成，参数用于修正Markdown过程中的标签错误
          options.complete(this.handleRawText(this.rawText));
        }
        return;
      }
      // console.log('currStepStr', currStepStr);

      if (stepIdx < currStepStr.length) {
        currText += currStepStr[stepIdx];
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
