import * as markybox from '@/core';
import { EditorActionType } from '@/code/socket/common/socket-service';
import { IPosition, ITuplePosition } from '@/core/app/common';
import { ArrayIterator } from '@/base/iterator';

const fps = 1;

interface IFakeUserInteraction {
  type: EditorActionType;
  position: ITuplePosition;
}

const actions: IFakeUserInteraction[] = [
  {
    type: EditorActionType.ChangePosition,
    position: [0, 0],
  },
  {
    type: EditorActionType.ChangePosition,
    position: [0, 1],
  },
  {
    type: EditorActionType.ChangePosition,
    position: [0, 2],
  },
  {
    type: EditorActionType.ChangePosition,
    position: [0, 3],
  },
  {
    type: EditorActionType.ChangePosition,
    position: [0, 4],
  },
  {
    type: EditorActionType.ChangePosition,
    position: [0, 5],
  },
  {
    type: EditorActionType.ChangePosition,
    position: [0, 6],
  },
  {
    type: EditorActionType.ChangePosition,
    position: [0, 7],
  },
  {
    type: EditorActionType.ChangePosition,
    position: [0, 8],
  },
  {
    type: EditorActionType.ChangePosition,
    position: [0, 9],
  },
  {
    type: EditorActionType.ChangePosition,
    position: [0, 10],
  },
  {
    type: EditorActionType.ChangePosition,
    position: [0, 11],
  }
]

export class DemoUserInteraction {
  private readonly userName = 'demo-user1';
  private readonly iterator: ArrayIterator<IFakeUserInteraction>;

  constructor(private readonly renderer: markybox.MHTMLRenderer) {
    this.iterator = new ArrayIterator(actions);

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
