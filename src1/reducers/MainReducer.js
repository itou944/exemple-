import {
    SET_LANGUAGE
} from '../actions/types';

const INITIAL_STATE = {
    nearPlaces: [],
    region: {},
    langID: 0
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SET_LANGUAGE:
            return { ...state, langID: action.payload };
        default:
            return state;
    }
};
