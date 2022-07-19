import { ref } from 'vue';
import * as markybox from '@/core';

const currentEditorLang = ref<markybox.EditorLang>(markybox.getDefaultSyntax());

function setEditorLang(lang: markybox.EditorLang): void {
    currentEditorLang.value = lang;
}

export default function useCurrentEditorNoteLang() {
    return {
        currentEditorLang,
        setEditorLang,
    }
}