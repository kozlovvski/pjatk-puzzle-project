import qs from "query-string"

import { formElem } from "../constants/elements";
import { SettingsFormValues } from "../typings/SettingsFormValues";

formElem.addEventListener("submit", (e) => {
  e.preventDefault();
  e.stopPropagation()

  const formData = Object.fromEntries(new FormData(formElem)) as SettingsFormValues
  
  const urlWithQueryString = qs.stringifyUrl({
    url: window.location.origin,
    query: formData
  })

  window.location.href = urlWithQueryString
})