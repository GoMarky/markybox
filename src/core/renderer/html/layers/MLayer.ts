import { MDomObject } from '@/core/renderer/html/MDomObject';

export abstract class MLayer extends MDomObject {
  protected zIndex = 0;
}
