import { ref } from 'vue';
import { EditorLang } from '@gomarky/markybox-core/lib/types/common';
import { getDefaultSyntax } from '@gomarky/markybox-core';

const currentEditorLang = ref<EditorLang>(getDefaultSyntax());

function setEditorLang(lang: EditorLang): void {
    currentEditorLang.value = lang;
}

export default function useCurrentEditorNoteLang() {
    return {
        currentEditorLang,
        setEditorLang,
    }
}
