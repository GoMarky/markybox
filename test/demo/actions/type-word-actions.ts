import { EditorActionType } from '@/code/socket/common/socket-service';
import { convertTextToUserInteraction, IFakeUserInteraction } from '../demo-user-interaction';

const text = `Welcome to markybox editor!
This is demo text, that running only for the first time you visit
our editor.

Good luck and have fun while using it.
If you have good experience with it, you can star us at github
https://github.com/GoMarky/markybox

if you have bad experience, please - open issue. Thank you!
`;

export const typeWordActions: IFakeUserInteraction[] = convertTextToUserInteraction(text);
