import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
  
const backgroundColors = {
	information: 'bg-blue-500',
	error: 'bg-red-700',
	warning: 'bg-yellow-600', 
	success: 'bg-green-500',
};

const icons = {
	information: <i className="fa-solid fa-circle-info" />,
	error: <i className="fa-solid fa-square-xmark" />,
	warning: <i className="fa-solid fa-triangle-exclamation" />,
	success: <i className="fa-solid fa-circle-check" />
};
  
const Feedback = ({
	state, title, message, listItems
}) => {
  
	return (
		<div className={`rounded-md ${backgroundColors[state]} p-3`}>
			<div className="flex">
				<div className='ml-3 text-white'>
					{title && (
						<label htmlFor='error-list'>
							{title}
						</label>
					)}
					{listItems.length || message ? (
						<div className='text-sm text-white' id="error-list">
							{icons[state] && (
								<div className='mr-2 inline-block'>
									{icons[state]}
								</div>
							)}
							{message || (
								<ul className="list-disc pl-5 space-y-1">
									{listItems.map((item) => (
										<li key={uuidv4()} className='text-sm px-3 py-2 rounded leading-5'>
											{item}
										</li>
									))}
								</ul>
							)}
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
};
  
Feedback.defaultProps = {
	state: 'information',
	message: '',
	listItems: [],
};
  
Feedback.propTypes = {
	state: PropTypes.oneOf(['success', 'warning', 'information', 'error']).isRequired,
	title: PropTypes.string,
	message: PropTypes.string,
	listItems: PropTypes.arrayOf(PropTypes.string),
};
  
export default Feedback;