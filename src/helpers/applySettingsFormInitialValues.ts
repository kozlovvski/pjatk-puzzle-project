import { formElem } from '../constants/elements';
import { MERGED_INITIAL_SETTINGS_VALUES } from '../constants/mergedInitialSettingsValues';

Object.entries(MERGED_INITIAL_SETTINGS_VALUES).forEach(([name, value]) => {
  const appropriateInput = formElem.querySelector<HTMLInputElement>(
    `[name="${name}"]`
  );

  if (!appropriateInput) {
    throw Error(`No input for name: ${name}`);
  }

  appropriateInput.value = value;
});
