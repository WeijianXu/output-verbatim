/*
 * @Author: WeijianXu weijian.xu@unidt.com
 * @Date: 2024-04-17 15:04:09
 * @LastEditors: WeijianXu weijian.xu@unidt.com
 * @LastEditTime: 2024-06-12 18:05:27
 * @FilePath: \output-verbatim\types\index.d.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

export type VerbatimText = string | number;

export type VerbatimStringArray = Array<string | string[]>;

export interface VerbatimOptions {
  /**
   * 字符打印速度
   */
  speed?: number;
  /**
   * 是否是富文本
   * 如果是，则将按照传入的数据富文本形式打印
   * 如果否，则按照原始数据打印
   */
  rich?: boolean;

  /**
   * 是否按照markdown格式将字符转成HTML输出
   * 如果是，则将按照markdown格式将字符转成HTML输出
   * 如果否，则按照原始数据输出
   */
  markdown?: boolean;

  /**
   * 传入字符从那里开始，默认从0开始，否则，从指定的index开始。
   * 位置小于start的字符，原样输出，没有逐字逐句打印效果
   */
  start?: number;

  /**
   * 是否逐字逐句输出，默认是
   * 如果否，则一次性输出整个文本内容
   */
  stream?: boolean;

  /**
   * 末尾是否换行，默认不换行
   */
  endLineBreak?: boolean;

  eachRound?: (currRichText: string, richText: string) => void;

  before?: (prefix?: string) => void;

  /**
   * 可以用来修正Markdown形式下标签不对的
   * @param finalText 最终打印的文本内容
   * @returns 
   */
  complete?: (finalText: string) => void;

  // customMade?: boolean;
}
/**
 * 按照传入的数据和配置进行打印
 *
 * @param text 需要打印的文本内容
 * @param options 配置项
 */
export default class VerbatimOutput {

}

export interface StepInfo {
  /**
   * 标签前缀，可能是标签本身，也可能是包含标签的前一段文本
   */
  prefix: string,

  /**
   * 标签本身
   */
  tag: string,

  /**
   * 标签后缀，目前是结束标签本身
   */
  suffix: string,

  /**
   * 标签包裹的内容
   */
  text: string,
}
