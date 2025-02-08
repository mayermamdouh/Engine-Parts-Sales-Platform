const { createSlice } = require("@reduxjs/toolkit")


const initialState = {items:[]}

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
    setFavorites: (state, action) => {
      state.items = action.payload;
    }
    }
});

export const {  setFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;