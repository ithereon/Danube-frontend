import React, {useState} from 'react';
import {Accordion, AccordionDetails, AccordionSummary} from '@mui/material';
import styles from '../styles/Faq.module.css';

const BtAccordion = (props) => {
	const [expanded, setExpanded] = useState(false);

	const handleChange = (panel) => (event, isExpanded) => {
		setExpanded(isExpanded ? panel : false);
	};
	return (
		<>
			{props?.data?.length > 0 && props.data?.map((item, index)=>(
				<Accordion key={index} expanded={expanded === `panel${index}`} onChange={handleChange(`panel${index}`)}>
					<AccordionSummary
						expandIcon={<i className='fas fa-angle-down' />}
					>
						{props.title ? props.title(item, index) : item}
					</AccordionSummary>
					<AccordionDetails className={styles.accordionDesc}>
						{props.answer ? props.answer(item, index) : item}
					</AccordionDetails>
				</Accordion>
			))}
		</>
	);
};

export default BtAccordion;