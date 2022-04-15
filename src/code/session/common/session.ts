import { createDecorator } from '@/platform/instantiation/common/instantiation';
import { Disposable } from '@/platform/lifecycle/common/lifecycle';
import { computed, ComputedRef, ref, Ref } from 'vue';
import { INoteInfo } from '@/code/notes/common/notes';
import { IEvent } from '@/base/event';

export class UserProfile extends Disposable {
  public readonly sessionId: Ref<string> = ref('');

  public readonly name: Ref<string> = ref('');
  public readonly email: Ref<string> = ref('');
  public readonly notes: Ref<INoteInfo[]> = ref([]);

  public readonly isAuth: ComputedRef<boolean> = computed(() => {
    const { sessionId } = this;

    return Boolean(sessionId.value);
  })

  constructor() {
    super();
  }

  public enableTestMode(): void {
    this.name.value = 'Andrew';
    this.sessionId.value = 'asdasdas';
    this.email.value = 'me@swen.tech';
    this.notes.value = [{
      data: 'class Test {  }',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      id: 'asdasdasd',
      title: 'test code'
    }]
  }

  public dispose() {
    this.name.value = '';
    this.email.value = '';
    this.notes.value = [];
  }
}

export interface ISessionService {
  readonly onDidUserLogin: IEvent<void>;
  readonly profile: UserProfile;

  login(email: Session.UserEmail, password: Session.UserPassword): Promise<void>;

  logout(): Promise<void>;

  restoreSession(): Promise<void>;
}

export const ISessionService = createDecorator<ISessionService>('sessionService');

export namespace Session {
  export type UserName = string;
  export type UserEmail = string;
  export type UserPassword = string;
  export type SessionId = string;
}
