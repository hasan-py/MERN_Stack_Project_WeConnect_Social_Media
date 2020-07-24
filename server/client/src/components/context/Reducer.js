export const initialState = {
    userDetails: false,
}

export const Reducer = (state, action) => {
    switch (action.type) {
        case 'USER':
            return {
                ...state,
                userDetails: action.payload
            }
        case "CLEAR":
            return {
                userDetails: null,
            }
        default:
            return state
    }
}