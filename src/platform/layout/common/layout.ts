import { createDecorator } from '@/platform/instantiation/common/instantiation';
import { Disposable } from '@/platform/lifecycle/common/lifecycle';
import { Ref, ref } from 'vue';
import { IEditorService } from '@/code/editor/common/editor-service';

export const ILayoutService = createDecorator<ILayoutService>('layoutService');

type ModalName = 'UserLoginModal' | 'UserProfileModal';

export class ModalController extends Disposable {
  public readonly isOpen: Ref<boolean> = ref(false);
  public readonly currentModal: Ref<string | null> = ref(null);

  constructor(private readonly editorService: IEditorService) {
    super();
  }

  public open(modalName: ModalName): void {
    this.editorService.editor.lock();

    this.currentModal.value = modalName;
    this.isOpen.value = true;
  }

  public close(): void {
    this.editorService.editor.unlock();

    this.currentModal.value = null;
    this.isOpen.value = false;
  }
}

export interface ILayoutService {
  readonly modal: ModalController;
}
