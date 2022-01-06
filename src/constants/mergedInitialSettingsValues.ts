import qs from 'query-string'

import { SettingsFormValues } from "../typings/SettingsFormValues";
import { DEFAULT_SETTINGS_VALUES } from "./defaultSettingsValues";

const queryValues = qs.parseUrl(window.location.href).query as Partial<SettingsFormValues>

export const MERGED_INITIAL_SETTINGS_VALUES: SettingsFormValues = {...DEFAULT_SETTINGS_VALUES, ...queryValues}
