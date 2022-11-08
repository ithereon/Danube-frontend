import StyledModal from '../../UI/styledModal';
import React from 'react';
import Button from '../../UI/button';


const PortalModal = ({value, isOpen, onClose, onChange, editItemHandler, id}) => {

	return (
		<StyledModal
			open={isOpen}
			onClose={onClose}
			background="bg-[#FFFFED]"
			closebutton="true"
			title="Notes"
			aria-labelledby="Item"
			aria-describedby="your to do item"
		>
			<div className="flex">
				<textarea
					className={'textarea'}
					rows="10"
					value={value}
					name="text"
					onChange={(e) => onChange(e.target.value)}
				/>
			</div>
			<div className={'flex justify-end'}>
				<Button clicked={() => editItemHandler(id)}>Save</Button>
			</div>

		</StyledModal>
	);
};
export default PortalModal;

