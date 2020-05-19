import {
    SET_LANGUAGE
} from './types';

const setLanguage = (langID) => ({
    type: SET_LANGUAGE,
    payload: langID
});

export { setLanguage };
