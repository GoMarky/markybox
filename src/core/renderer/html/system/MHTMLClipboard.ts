import { MObject } from '@/core/objects/MObject';
import { MRow } from '@/core/objects/MRow';
import { Mime } from '@/base/string';

const endl = '\n';

export class MHTMLClipboard extends MObject {
  constructor() {
    super();
  }

  public async write(rows: MRow[]): Promise<void> {
    const text = rows.map((row) => MHTMLClipboard.rowToText(row)).join(endl);

    const type: Mime = 'text/plain';
    const blob: Blob = new window.Blob([text], { type });
    const data: ClipboardItem[] = [new ClipboardItem({ [type]: blob })];

    await window.navigator.clipboard.write(data);
  }

  public read(): Promise<string> {
    return window.navigator.clipboard.readText();
  }

  private static rowToText(row: MRow): string {
    return row.content.text;
  }
}
