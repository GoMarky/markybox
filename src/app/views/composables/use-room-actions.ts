import { HTMLRenderer } from '@gomarky/markybox-core';

export type EditorActionPayload = { position: string, user_name: string };
export type EditorEnterRoomPayload = { user_name: string };
export type EditorLeaveRoomPayload = { user_name: string };

export default function useRoomActions(renderer: HTMLRenderer) {
    function onLeaveRoom(data: EditorLeaveRoomPayload): void {
        const { user_name } = data;

        renderer.navigatorManager.remove(user_name);
    }

    function onEnterRoom(data: EditorEnterRoomPayload): void {
        const { user_name } = data;

        renderer.navigatorManager.add(user_name);
    }

    function onEditorAction(data: EditorActionPayload): void {
        const { position, user_name: userNameFromSocket } = data;

        if (userNameFromSocket === 'TeodorDre') {
            return;
        }

        const [row, column] = position.split(',').map((coordinate) => Number(coordinate));

        renderer.navigatorManager.commandCenter.changePosition(userNameFromSocket, { row, column });
    }


    return {
        onEnterRoom,
        onLeaveRoom,
        onEditorAction,
    }
}
