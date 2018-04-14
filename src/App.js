import React, { Component } from 'react';
import list from './list';
import { Grid, Row, FormGroup } from 'react-bootstrap';

//parametros default para traer datos de la API (https://hn.algolia.com/api)

const DEFAULT_QUERY = 'react';
const DEFAULT_PAGE = 0;
const DEFAULT_HPP = 10;
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&${PARAM_PAGE}&${PARAM_HPP}${DEFAULT_HPP}`;

console.log(url);

//fitro de resultados de busqueda (high order function)
function isSearched(searchTerm){
	return function(item){
		return !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());
	}
}

class App extends Component {
	//seteo de internal componen state
	//Class en ES6 puede usar constructor para inicializar internal state
	constructor(props){
		//super props setea this.props al constructor
		super(props);
		//seteo state
		this.state ={
			results: null,
			searchKey: '',
			searchTerm: DEFAULT_QUERY
		}
		//bindear funciones a this (app component)
		this.removeItem = this.removeItem.bind(this);
		this.searchValue = this.searchValue.bind(this);
		this.fetchTopStories = this.fetchTopStories.bind(this);
		this.setTopStories = this.setTopStories.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	//metodo setTopStories
	setTopStories(result){
		const { hits, page } = result;

		const { searchKey, results } = this.state;

		const oldHits = results && results[searchKey] ? results[searchKey].hits : [];
		const updatedHits = [...oldHits, ...hits]
		this.setState({ results: { ...results, [searchKey]: {hits: updatedHits, page} } });
	}

	fetchTopStories(searchTerm, page){
		fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
			.then(response => response.json())
			.then(result => this.setTopStories(result))
			.catch(e => e);
	}

	componentDidMount(){
		const { searchTerm } = this.state;
		this.setState({ searchKey: searchTerm });
		this.fetchTopStories(searchTerm, DEFAULT_PAGE);
	}

	onSubmit(event){
		const { searchTerm } = this.state;
		this.setState({ searchKey: searchTerm });
		this.fetchTopStories(searchTerm, DEFAULT_PAGE);
		event.preventDefault()
	}
	
	removeItem(id){
		const { results, searchKey } = this.state;
		const { hits, page } = results[searchKey];
		const updatedList = hits.filter(item => item.objectID !== id);
		this.setState({ results: {...results, [searchKey]: {hits: updatedList, page}} });
	}

	searchValue(event){
		this.setState({ searchTerm: event.target.value })
	}

  render() {

		const { results, searchTerm, searchKey } = this.state;
		const page = (results && results[searchKey] && results[searchKey].page) || 0;
		const list = (results && results[searchKey] && results[searchKey].page) || [];

		console.log(this);
    return (
			<div>
				<Grid fluid>
					<Row>
						<div className="jumbotron text-center">
						<Search
							onChange={ this.searchValue }
							value={ searchTerm }
							onSubmit={ this.onSubmit }
						>NEWS APP </Search>
						</div>
					</Row>
				</Grid>


				<Table 
					list={ list }
					searchTerm={ searchTerm }
					removeItem= {this.removeItem }
				/>

				<div className="text-center alert">
				<Button
					className="btn btn-primary btn-lg"
					onClick={ () => this.fetchTopStories(searchTerm, page + 1) }>
						Load More
					</Button>
				</div>

			</div>
		);
	}
}

//Stateless components
const Search = ({ onChange, value, children, onSubmit }) => {
	return(
		<form onSubmit={ onSubmit }>
			<FormGroup>
				<h1 style={{ fontWeight: 'bold' }}>{ children }</h1>
				<hr style={{ border: '2px solid black', width: '100px' }}/>
				<div className="input-group">
					<input 
						className="form-control width100 searchForm"
						type="text" 
						onChange={ onChange }
						value={ value }
					/>
					<span className="input-group-btn">
						<button
							className="btn btn-primary searchBtn"
							type="submit"
							>
							Search
						</button>
					</span>
				</div>
			</FormGroup>
		</form>
	)
}

const Table = ({ list, searchTerm, removeItem }) => {
	return(
		<div className="col-sm-10 col-sm-offset-1 ">
			{
				list.map(item => 
					<div key={ item.objectID }>
						<h2>
							<a href={ item.url }>"{ item.title }"</a> by { item.author }
						</h2>
						<h4> Comments: { item.num_comments }  |  { item.points } points
							{ /* adentro de JSX los comentarios son asi! */}
							{ /* para usar la palabra this usamos arrow functions */}
							<Button
								className="btn btn-danger btn-xs remove"
								type="button"
								onClick={ () => removeItem(item.objectID) } >
								Remove
							</Button>
						</h4> <hr />
					</div>
				)
			}
		</div>
	)

}

const Button = ({ onClick, children, className='' }) =>
	<button
		className={ className }
		type="button"
		onClick={ onClick } >
		{ children }
	</button>
	

export default App;
