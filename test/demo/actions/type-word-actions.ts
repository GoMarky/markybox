import { EditorActionType } from '@/code/socket/common/socket-service';
import { IFakeUserInteraction } from '../demo-user-interaction';

export const typeWordActions: IFakeUserInteraction[] = [
  {
    type: EditorActionType.ChangePosition,
    position: [0, 0],
  },
  {
    type: EditorActionType.EnterSymbol,
    position: [0, 0],
    data: 'H'
  },
  {
    type: EditorActionType.EnterSymbol,
    position: [0, 1],
    data: 'e'
  },
  {
    type: EditorActionType.EnterSymbol,
    position: [0, 2],
    data: 'l'
  },
  {
    type: EditorActionType.EnterSymbol,
    position: [0, 3],
    data: 'l'
  },
  {
    type: EditorActionType.EnterSymbol,
    position: [0, 4],
    data: 'o'
  },
  {
    type: EditorActionType.EnterSymbol,
    position: [0, 5],
    data: ' '
  },
  {
    type: EditorActionType.EnterSymbol,
    position: [0, 6],
    data: 'w'
  },
  {
    type: EditorActionType.EnterSymbol,
    position: [0, 7],
    data: 'o'
  },
  {
    type: EditorActionType.EnterSymbol,
    position: [0, 8],
    data: 'r'
  },
  {
    type: EditorActionType.EnterSymbol,
    position: [0, 9],
    data: 'l'
  },
  {
    type: EditorActionType.EnterSymbol,
    position: [0, 10],
    data: 'd'
  },
  {
    type: EditorActionType.EnterSymbol,
    position: [0, 11],
    data: '!'
  }
]
