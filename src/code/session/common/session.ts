import { createDecorator } from '@/platform/instantiation/common/instantiation';
import { Disposable } from '@/platform/lifecycle/common/lifecycle';
import { computed, ComputedRef, ref, Ref } from 'vue';
import { INoteInfo } from '@/code/notes/common/notes';
import { nanoid } from 'nanoid';

export class UserProfile extends Disposable {
  public readonly sessionId: Ref<string> = ref('asdad12dasd12dad2434566yhjgfkmn5i64mtfd');

  public readonly name: Ref<string> = ref('Teodor_Dre');
  public readonly email: Ref<string> = ref('swen295@gmail.com');
  public readonly notes: Ref<INoteInfo[]> = ref([
    {
      id: nanoid(5),
      title: 'Javascript Code',
      updatedAt: 1648736390,
      createdAt: 1648736390,
      data: `
function log() {
  const isTest = process.env.IS_TEST;
  console.log(123)
}`,
    }
  ]);

  public readonly isAuth: ComputedRef<boolean> = computed(() => {
    const { sessionId } = this;

    return Boolean(sessionId.value);
  })

  public dispose() {
    this.name.value = '';
    this.email.value = '';
    this.notes.value = [];
  }
}

export interface ISessionService {
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
