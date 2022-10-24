import { ArrayIterator } from '@/base/iterator';
import { IPosition, ITuplePosition } from '@gomarky/markybox-core/lib/types/common';
import { EditorActionType } from '@/app/code/socket/common/socket-service';
import { HTMLRenderer } from '@gomarky/markybox-core';

export interface IFakeUserInteraction {
  type: EditorActionType;
  position: ITuplePosition;
  data?: any;
}

export function convertTextToUserInteraction(text: string): IFakeUserInteraction[] {
  const actions: IFakeUserInteraction[] = [];
  const chars = text.split('');

  let row = 0;
  let column = 0;

  for (const char of chars) {
    if (char === '\n') {
      row += 1;
      column = 0;
    } else {
      column += 1;
    }

    actions.push({ type: EditorActionType.EnterSymbol, position: [row, column], data: char })
  }

  return actions;
}

export class DemoUserInteraction {
  private readonly iterator: ArrayIterator<IFakeUserInteraction>;
  private animationFrameId: number;

  constructor(
    private readonly renderer: HTMLRenderer,
    private readonly actions: IFakeUserInteraction[],
    private readonly userName: string,
    private readonly fps: number) {
    this.iterator = new ArrayIterator(this.actions);

    this.renderer.navigatorManager.add(this.userName);

    this.start();
  }

  private interact(interaction: IFakeUserInteraction): void {
    const { navigatorManager } = this.renderer;
    const { position, type } = interaction;
    const [row, column] = position;
    const normalizedPosition: IPosition = { row, column }

    switch (type) {
      case EditorActionType.ChangePosition: {
        navigatorManager.commandCenter.changePosition(this.userName, normalizedPosition);
        break;
      }
      case EditorActionType.EnterSymbol: {
        navigatorManager.commandCenter.enterSymbol(this.userName, normalizedPosition, interaction.data);
        break;
      }
    }
  }

  public start(): void {
    this.animationFrameId = window.requestAnimationFrame(this.loop)
  }

  public loop = (): void => {
    let current = this.iterator.next();

    if (current) {
      this.interact(current);
    } else {
      window.cancelAnimationFrame(this.animationFrameId);
    }

    window.setTimeout(() => {
      window.requestAnimationFrame(this.loop)
    }, 1000 / this.fps)
  }
}
