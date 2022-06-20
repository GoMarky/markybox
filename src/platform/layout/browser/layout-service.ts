import { Disposable } from '@/platform/lifecycle/common/lifecycle';
import { ILayoutService, ModalController } from '@/platform/layout/common/layout';
import { IEditorService } from '@/code/editor/common/editor-service';

export class LayoutService extends Disposable implements ILayoutService {
  public readonly modal: ModalController;

  constructor(
    @IEditorService private readonly editorService: IEditorService,
  ) {
    super();

    this.modal = new ModalController(editorService);
  }
}
