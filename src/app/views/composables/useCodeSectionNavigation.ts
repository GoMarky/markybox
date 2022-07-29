import { ref } from 'vue';

export type CodeSection = 'Code' | 'Files' | 'Console' | 'Commands';

const currentSection = ref<CodeSection>('Code');

const setSection = (section: CodeSection) => {
  currentSection.value = section;
}

const useCodeSectionNavigation = () => {
  return {
    setSection,
    currentSection,
  }
};

export default useCodeSectionNavigation;
