import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	username: null,
	isVerified: true,
	isLoading: true,
	isAuthenticated: false,
	error: null,
	id: ''
};

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setIsAuthenticated: (state, { payload }) => {
			state.isAuthenticated = payload.status === 200;
			state.isLoading = false;
		},
		setUser: (state, {payload}) => {
			console.log('user payload: ', payload);
			state.username = payload.username;
		}
	},
	// extraReducers: (builder) => {
	// builder.addCase(checkStatus.pending, (state) => {
	// 	state.isLoading = true;
	// });

	// builder.addCase(checkStatus.fulfilled, (state, { payload }) => {
	// 	state.isAuthenticated = payload.isAuthenticated;
	// 	state.username = payload.username;
	// 	state.isVerified = payload.isVerified;
	// 	state.isSetPassword = payload.isSetPassword;
	// 	state.isLoading = false;
	// });

	// builder.addCase(checkStatus.rejected, (state) => {
	// 	state.isAuthenticated = false;
	// 	state.isLoading = false;
	// });
	// },
});

export const selectAuth = (state) => state.auth;

export const { setIsAuthenticated, setUser } = authSlice.actions;

export default authSlice.reducer;
