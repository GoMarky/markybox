import { MObject } from '@/core/objects/MObject';
import { Mime } from '@/base/string';

export class MHTMLClipboard extends MObject {
  constructor() {
    super();
  }

  public async write(text: string): Promise<void> {
    const type: Mime = 'text/plain';
    const blob: Blob = new window.Blob([text], { type });
    const data: ClipboardItem[] = [new ClipboardItem({ [type]: blob })];

    await window.navigator.clipboard.write(data);
  }

  public read(): Promise<string> {
    return window.navigator.clipboard.readText();
  }
}
