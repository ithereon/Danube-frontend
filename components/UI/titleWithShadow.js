import React from 'react';

const TitleWithShadow = (props) => (
	<div className='font-semibold text-center leading-normal mt-0 mb-2 text-neutral-700 relative after:content-[attr(data-value)] after:scale-150 after:font-bold after:leading-normal after:mt-0 after:mb-2 after:text-indigo-50 after:text-center after:absolute after:top-0 after:left-0 after:w-full after:block after:-z-10' data-value={props.children}>
		{props.children}
	</div>
);

export default TitleWithShadow;