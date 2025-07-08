/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React, { createContext, useContext } from 'react';

import {
  bg_BG,
  ca_ES,
  cs_CZ,
  da_DK,
  de_DE,
  el_GR,
  en_GB,
  en_US,
  es_ES,
  et_EE,
  eu_ES,
  fa_IR,
  fi_FI,
  fr_FR,
  gl_ES,
  hi_IN,
  hu_HU,
  id_ID,
  it_IT,
  ja_JP,
  ko_KR,
  lt_LT,
  lv_LV,
  nb_NO,
  nl_NL,
  pt_BR,
  pt_PT,
  ro_RO,
  ru_RU,
  sv_SE,
  th_TH,
  tr_TR,
  zh_Hans_CN,
  zh_Hant_TW,
} from '../i18n';
import { useStore } from './store';

export const languages = {
  default: en_US,
  bg_BG,
  ca_ES,
  cs_CZ,
  da_DK,
  de_DE,
  el_GR,
  en_GB,
  en_US,
  es_ES,
  et_EE,
  eu_ES,
  fa_IR,
  fi_FI,
  fr_FR,
  gl_ES,
  hi_IN,
  hu_HU,
  id_ID,
  it_IT,
  ja_JP,
  ko_KR,
  lt_LT,
  lv_LV,
  nb_NO,
  nl_NL,
  pt_BR,
  pt_PT,
  ro_RO,
  ru_RU,
  sv_SE,
  th_TH,
  tr_TR,
  zh_Hans_CN,
  zh_Hant_TW,
};

export const TranslationContext = createContext(languages.default);

const useTranslation = () => {
  const translation = useContext(TranslationContext);
  return translation;
};

const getCurrLanguage = (languageDetected) => {
  const langKeys = Object.keys(languages);
  if (langKeys.includes(languageDetected)) {
    return languageDetected;
  }
  return 'default';
};

const Translation = ({ children }) => {
  const storeCtx = useStore();

  //getting error because the nullish coalescing operator (??) isn't supported by your Babel/Webpack setup yet.
  //const currLanguage = getCurrLanguage(storeCtx?.config?.locale ?? '');

  //workaround
  const currLanguage = getCurrLanguage(
    storeCtx && storeCtx.config && storeCtx.config.locale
      ? storeCtx.config.locale
      : ''
  );


  return (
    <TranslationContext.Provider value={languages[currLanguage]}>
      {children}
    </TranslationContext.Provider>
  );
};

export default Translation;
export { getCurrLanguage, useTranslation };
