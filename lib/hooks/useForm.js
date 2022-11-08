const useForm = (formik) => {
	const errorKeys = Object.keys(formik.errors).filter((errorKey) => formik.touched[errorKey]);
	if (errorKeys.length === 0) {
		return { isError: false };
	}
	const errorMessages = errorKeys.map((errorKey) => formik.errors[errorKey]);

	let subErrors = {};
	let subErrorsLength = 0;
	// eslint-disable-next-line no-unused-vars
	const errorsToCount = Object.keys(formik.errors).map((errorKey) => {
		Object.entries(formik.errors[errorKey]).map(e=>{
			e.forEach(item=>{
				if(typeof item === 'object'){
					subErrorsLength += Object.keys(item).length ? Object.keys(item).length : 0;
				}
			});
		});
	});

	const subKeys = subErrors && Object.keys(subErrors).filter((errorKey) => errorKey[0]);
	const subErrorMessages = subErrors && Object.entries(subErrors).filter((errorKey) => errorKey[1]);

	return {
		isError: true,
		errorKeySet: new Set(errorKeys),
		title: errorMessages.length === 1 ? errorKeys[0]+': '+ errorMessages[0] : `${errorMessages.length} inputs have issues, make sure you follow validation rules.`,
		errorList: errorMessages.length === 1 ? [] : errorMessages,
		errors: formik.errors,
		subErrors: subErrors,
		subKeySet: new Set(subKeys),
		subTitle: subErrors.length === 1 ? subKeys[0] + ': ' + subErrorMessages[0] : `${subErrorsLength} inputs have issues, make sure you follow validation rules.`
	};
};
  
export default useForm;