import React from 'react';
import './App.scss';
import {createApiClient, Ticket} from './api';

export type AppState = {
	tickets?: Ticket[],
	page?: number, 
	search: string;
	
}

const api = createApiClient();

export class App extends React.PureComponent<{}, AppState> {


	state: AppState = {
		
		page: 0 ,
		search: ''
	}

	searchDebounce: any = null;

	async componentDidMount() {
		
		this.setState({
			tickets: await api.getTickets()
		});
	}


	renderTickets = (tickets: Ticket[]) => {
		
		const filteredTickets = tickets
			.filter((t) => (t.title.toLowerCase() + t.content.toLowerCase()).includes(this.state.search.toLowerCase()));


		return (<ul className='tickets' >
			{filteredTickets.map((ticket) => (<li key={ticket.id} className='ticket'>
				<div className='hide'>Hide</div>
				<h5 className='title'>{ticket.title}</h5>
				<p className='content'>{ticket.content}</p>
				<div className='showLess' >Show less</div>
				<div className='tags'>{ticket.labels? ticket.labels.map((labels)=>(<span key={labels} className ='label'>{labels}</span>))  : null }</div>
				<footer>
					<div className='meta-data'>By {ticket.userEmail} | { new Date(ticket.creationTime).toLocaleString()}</div>
				</footer>
			</li>))}
		</ul>);
	}

	onSearch = async (val: string, newPage?: number) => {
		
		clearTimeout(this.searchDebounce);

		this.searchDebounce = setTimeout(async () => {
			this.setState({
				search: val

			});
			this.setState({page: newPage})
		},300);
	}

	render() {	
		const {tickets} = this.state;

		return (<main>
			<h1>Tickets List</h1>
			<header>
				<input type="search" placeholder="Search..." onChange={(e) => this.onSearch(e.target.value)}/>
			</header>
			{tickets ? <div className='results'>Showing {tickets.length} results</div> : null }	
			{tickets ? this.renderTickets(tickets) : <h2>Loading..</h2>}
		</main>)
	}
}

export default App;