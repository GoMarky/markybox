import * as markybox from '@/core';
import { EditorActionType } from '@/code/socket/common/socket-service';
import { IPosition, ITuplePosition } from '@/core/app/common';
import { ArrayIterator } from '@/base/iterator';

const fps = 1;

export interface IFakeUserInteraction {
  type: EditorActionType;
  position: ITuplePosition;
  data?: any;
}

export class DemoUserInteraction {
  private readonly iterator: ArrayIterator<IFakeUserInteraction>;

  constructor(
    private readonly renderer: markybox.MHTMLRenderer,
    private readonly actions: IFakeUserInteraction[],
    private readonly userName: string,
    private readonly index: number) {
    this.iterator = new ArrayIterator(this.actions);

    this.renderer.navigatorManager.add(this.userName);

    this.start();
  }

  private interact(interaction: IFakeUserInteraction): void {
    const { navigatorManager } = this.renderer;
    const { position, type } = interaction;
    const [row, column] = position;
    const normalizedPosition: IPosition = { row: this.index, column }

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
    window.requestAnimationFrame(this.loop)
  }

  public loop = (): void => {
    let current = this.iterator.next();

    if (!current) {
      current = this.iterator.first();
    }

    if (current) {
      this.interact(current);
    }

    window.setTimeout(() => {
      window.requestAnimationFrame(this.loop)
    }, 1000 / fps)
  }
}
