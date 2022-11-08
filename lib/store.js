import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';


// import languageReducer from './Common/Language/languageSlice';
// import authStore from './Auth/store';

const store = configureStore({
	reducer: {
		auth: authReducer,
		// language: languageReducer,
		// ...authStore,
	},
});

export default store;
