import React, {useState, useEffect} from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Loading from '../components/UI/loading';
import { normalDate } from './utils';

const ContractPDF = ({data, status, type}) => {
	const [PDF, setPDF] = useState();

	useEffect(() => {
		const doc = new jsPDF();
		const WIDTH = doc.internal.pageSize.getWidth();
		// multiply spaces by 1.5 if expecting 2 lines above
		const LINE_SPACE = 5;
		const TITLE_SPACE = 7;
		const SEPARATOR_SPACE = 6.6;
		// coordinates
		const X_position = 15;
		let Y_position = 20;

		doc.setProperties({ title: `Contract #${data.id}` });
		// title
		doc.setTextColor('#333');
		doc.setFontSize(22);
		doc.setFont('helvetica', 'normal', 'bold');
		doc.text(type === 'invoice' ? 'INVOICE' : 'CONTRACT', X_position, Y_position);

		// date
		autoTable(doc, {
			columns: [ { dataKey: 'label', header: 'label' }, { dataKey: 'value', header: 'value' } ],
			showHead: false,
			body: [ ['Created at:', normalDate(data.created_at)] ],
			theme: 'plain',
			styles: { textColor: '#333', fontStyle: 'normal', halign: 'right', cellPadding: 0, fontSize: 10 },
			columnStyles: { label: { fontStyle: 'bold' } },
			startY: 15,
			margin: { left: WIDTH - 50 - 15},
			tableWidth: 50,
		});

		// ID
		doc.setFontSize(11);
		doc.setFont('helvetica', 'normal', 'normal');
		doc.text(`Contract ID: ${data.id}`, X_position, Y_position+=SEPARATOR_SPACE);

		// status
		doc.setFontSize(11);
		doc.text(`Status: ${status || data.status.replace(/_/g,' ')}`, X_position, Y_position+=TITLE_SPACE);

		// separator
		doc.setDrawColor('#333');
		doc.setLineWidth(0.3);
		doc.line(X_position, Y_position+=SEPARATOR_SPACE, WIDTH-15, Y_position);

		// "from" section title
		doc.setFontSize(12);
		doc.setTextColor('#000');
		doc.text('From:', X_position, Y_position+=SEPARATOR_SPACE);

		// customer name
		doc.setFontSize(11);
		doc.setFont('helvetica', 'normal', 'bold');
		doc.setTextColor('#333');
		doc.text(data.owner_name, X_position, Y_position+=TITLE_SPACE);

		// customer property address
		doc.setFontSize(11);
		doc.setFont('helvetica', 'normal', 'normal');
		doc.setTextColor('#333');
		doc.text(
			`${data.property_obj.address_1}, ${data.property_obj.address_2 && data.property_obj.address_2 + ', '}${data.property_obj.town}, ${data.property_obj.city && data.property_obj.city + ', '}${data.property_obj.county}, ${data.property_obj.postcode}`,
			X_position,
			Y_position+=TITLE_SPACE,
			{ maxWidth: WIDTH - 30 }
		);

		// "to" section title
		doc.setFontSize(12);
		doc.setTextColor('#000');
		doc.text('To:', X_position, Y_position+=(SEPARATOR_SPACE*1.5) );

		// business name
		doc.setFontSize(11);
		doc.setFont('helvetica', 'normal', 'bold');
		doc.setTextColor('#333');
		doc.text(data.business_name, X_position, Y_position+=TITLE_SPACE);

		// business property address
		doc.setFont('helvetica', 'normal', 'normal');
		doc.text(
			`${data.business.address_1}, ${data.business.address_2 && data.business.address_2 + ', '}${data.business.town}, ${data.business.city && data.business.city + ', '}${data.business.county}, ${data.business.postcode} hello just to test second line thingy`,
			X_position,
			Y_position+=TITLE_SPACE,
			{ maxWidth: WIDTH - 30 }
		);

		// separator
		doc.setDrawColor('#333');
		doc.setLineWidth(0.3);
		doc.line(X_position, Y_position+=(SEPARATOR_SPACE*1.5), WIDTH-15, Y_position);

		// contract title label
		doc.setFont('helvetica', 'normal', 'bold');
		doc.text( 'Title:', X_position, Y_position+=SEPARATOR_SPACE );

		// contract title
		doc.setFont('helvetica', 'normal', 'normal');
		doc.text(
			data.title,
			X_position,
			Y_position+=TITLE_SPACE,
			{ maxWidth: WIDTH - 30 }
		);

		if(data.description){
			// contract description label
			doc.setFont('helvetica', 'normal', 'bold');
			doc.text( 'Description:', X_position, Y_position+=(TITLE_SPACE*1.5) );

			// contract description
			doc.setFont('helvetica', 'normal', 'normal');
			const desc_lines = doc.splitTextToSize(data.description, WIDTH - 30);
			desc_lines.forEach((line,index) => {
				doc.text(
					line,
					X_position,
					index === 0 ? Y_position+=TITLE_SPACE : Y_position+=LINE_SPACE
				);
			});
		}

		// general description
		doc.setFont('helvetica', 'italic', 'normal');
		doc.text(
			`This contract is confirmation that ${data.owner_name} and ${data.business_name} both agree to Billntrade terms and conditions and accept the work to be carried out by ${data.business_name} and paid by ${data.owner_name} as described below.`,
			X_position,
			Y_position+=(SEPARATOR_SPACE*1.5),
			{ maxWidth: WIDTH - 30 }
		);

		// separator
		doc.setDrawColor('#333');
		doc.setLineWidth(0.3);
		doc.line(X_position, Y_position+=(SEPARATOR_SPACE*1.5), WIDTH-15, Y_position);

		// work items title
		doc.setFont('helvetica', 'normal', 'bold');
		doc.text(
			'Work items:',
			X_position,
			Y_position+=SEPARATOR_SPACE
		);

		if(data.work_items?.length > 0){
			autoTable(doc, {
				// head: [['#', 'Title', 'Description', 'Price £']],
				columns: [
					{ dataKey: 'id', header: '#' },
					{ dataKey: 'title', header: 'Title' },
					{ dataKey: 'description', header: 'Description' },
					{ dataKey: 'price', header: 'Price £' },
				],
				body: [
					...data.work_items.map(item=>[item.id, item.title, item.description, item.price])
				],
				theme: 'striped',
				styles: { fillColor: '#fff', fontSize: 10 },
				headStyles: {
					fillColor: '#333',
				},
				columnStyles: {
					'price': { halign: 'right' },
				},
				startY: Y_position+=TITLE_SPACE,
				tableWidth: WIDTH - 30,
				pageBreak: 'auto',
				rowPageBreak: 'auto',
				// align only price to right
				didParseCell: (hookData) => {
					if (hookData.section === 'head') {
						if (hookData.column.dataKey === 'price') {
							hookData.cell.styles.halign = 'right';
						}
					}
				}
			});
			// y point where table finishes
			Y_position = doc.lastAutoTable.finalY;
		}else{
			doc.setFont('helvetica', 'italic', 'normal');
			doc.setTextColor('red');
			doc.text(
				'0 work items added to contract, please make sure you add at least one.',
				X_position,
				Y_position+=(SEPARATOR_SPACE*1.5),
				{ maxWidth: WIDTH - 30 }
			);
		}

		// separator
		doc.setDrawColor('#333');
		doc.setLineWidth(0.3);
		doc.line(X_position, Y_position+=SEPARATOR_SPACE, WIDTH-15, Y_position);

		const costs = [
			['Subtotal:', `£${data.total_cost}`]
		];
		if(data.discount_type === 1){
			costs.push(['Discount %:', data.discount]);
			costs.push(['Discount amount:', `£${data.discount_amount}`]);
		}else{
			costs.push(['Discount:', `£${data.discount}`]);
		}
		costs.push(['Subtotal after discount:', `£${data.subtotal_after_discount}`]);
		costs.push(['VAT %:', data.vat]);
		costs.push(['VAT amount:', `£${data.vat_amount}`]);
		costs.push(['Total to pay:', `£${data.total}`]);
		if(data.first_payment_amount > 0){
			costs.push(['First payment:', `£${data.first_payment_amount}`]);
			costs.push(['Balance to pay:', `£${data.total_after_first_payment}`]);
		}

		// calculations table
		autoTable(doc, {
			columns: [
				{ dataKey: 'label', header: 'label' },
				{ dataKey: 'amount', header: 'amount' },
			],
			showHead: false,
			body: costs,
			theme: 'plain',
			styles: {
				textColor: '#333', fontStyle: 'normal', align: 'left'
			},
			columnStyles: {
				label: { fontStyle: 'bold' },
				amount: {halign: 'right'}
			},
			startY: Y_position+=SEPARATOR_SPACE,
			margin: { left: WIDTH - 60 - 20},
			tableWidth: 65,
			pageBreak: 'auto',
			rowPageBreak: 'auto',
		});
		// table end y position
		Y_position = doc.lastAutoTable.finalY;

		if(type === 'invoice'){
			// separator
			doc.setDrawColor('#333');
			doc.setLineWidth(0.3);
			doc.line(X_position, Y_position+=SEPARATOR_SPACE, WIDTH-15, Y_position);

			// vat
			doc.setFont('helvetica', 'normal', 'normal');
			doc.text(
				`VAT: ${data.business.vat}`,
				WIDTH/2,
				Y_position+=(SEPARATOR_SPACE),
				{ maxWidth: WIDTH - 30, align: 'center' }
			);
		}

		setPDF(doc.output('bloburi', 'contract.pdf'));
	}, []);


	if(!PDF) return <Loading />;

	return (
		<iframe src={PDF} height="100%" width="100%" className='absolute w-screen h-screen' />
	);
};

export default ContractPDF;
