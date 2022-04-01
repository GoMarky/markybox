import { createDecorator } from '@/platform/instantiation/common/instantiation';
import { Disposable } from '@/platform/lifecycle/common/lifecycle';
import { computed, ComputedRef, ref, Ref, toRef } from 'vue';

interface IUserNote {
  created_at: number;
  data: string;
}

export class UserProfile extends Disposable {
  public readonly name: Ref<string> = ref('TeodorDre');
  public readonly notes: Ref<IUserNote[]> = ref([
    {
      created_at: 1648736390,
      data: `
function log() {
  const isTest = process.env.IS_TEST;
  console.log(123)
}`,
    }
  ]);

  public readonly isAuth: ComputedRef<boolean> = computed(() => {
    const { name } = this;

    return Boolean(name);
  })

  public dispose() {
    this.name.value = '';
    this.notes.value = [];
  }
}

export interface ISessionService {
  readonly profile: UserProfile;

  restoreSession(): Promise<void>;
}

export const ISessionService = createDecorator<ISessionService>('sessionService');

export namespace Session {
  export type UserEmail = string;
  export type UserPassword = string;
}
