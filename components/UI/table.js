import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/system';
import PropTypes from 'prop-types';
import TablePagination from '@mui/material/TablePagination';
import Loading from './loading';

const styledPaper = styled(Paper)(`
    box-shadow: none;
    font-family: 'Poppins', sans-serif;
    th {
        // gray 800
        color: #1f2937;
    }
    thead {
        // slate 100
        background-color: #f1f5f9;
    }
    thead th {
        font-weight: 600;
        // slate 600
        color: #475569;
        background-color: #f1f5f9;
        font-family: 'Poppins', sans-serif;
        text-transform: capitalize;
		padding: 21px 16px;
		white-space: nowrap;
    }
`);
const StyledHead = styled(TableHead)({
	fontWeight: 'bold !important'
});

const StyledTable = (props) => {
	const {data} = props;
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	// const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - props.data.length) : 0;

	return (
		<>
			<TableContainer component={styledPaper} sx={{ maxHeight: 500 }}>
				<Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
					<StyledHead>
						<TableRow>
							{props.rows?.map((item,index)=>(
								<TableCell 
									key={item} 
									align={index === 0 ? 'left' : 'center'}
								>
									{item}
								</TableCell>
							))}
						</TableRow>
					</StyledHead>
					<TableBody>
						{(!data || data.length <= 0) && (
							<TableRow
								style={{
									height: 53 *3,
								}}
								sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
							>
								<TableCell colSpan={6}>
									<Loading />
								</TableCell>
							</TableRow>
						)}
						{data?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((item) => (
								<TableRow
									key={item.id}
									sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
								>
									{Object?.entries(item).map((obj,index)=>(
										<TableCell 
											component="th" 
											scope="row" 
											key={obj[0]}
											align={index === 0 ? 'left' : 'center'}
										>
											{obj[1]}
										</TableCell>
									))}
								</TableRow>
							))}
						{/* {emptyRows > 0 && (
						<TableRow
							style={{
								height: 53 * emptyRows,
							}}
						>
							<TableCell colSpan={6} />
						</TableRow>
					)} */}
					</TableBody>
				</Table>
			
			</TableContainer>
			<TablePagination
				// rowsPerPageOptions={[1, 2, 5, 10, 25]}
				rowsPerPageOptions={[]}
				component="div"
				count={props.data?.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
				// labelRowsPerPage={<span>Per page:</span>}
				labelRowsPerPage=''
				labelDisplayedRows={({ page, count }) => {
					return `Page ${page+1} of ${Math.ceil(count / rowsPerPage)}`;
				}}


			/>
		</>
	);
};
export default StyledTable;

StyledTable.defaultProps = {
	rows: ['sample title'],
};

StyledTable.propTypes = {
	rows: PropTypes.arrayOf(PropTypes.string),
	data: PropTypes.arrayOf(PropTypes.object)
};