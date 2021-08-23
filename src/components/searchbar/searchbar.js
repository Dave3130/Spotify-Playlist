import React from 'react';
import './searchbar.css';

class SearchBar extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      term: '',
      error: ''
    };
    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }
  
  // Sets the argument for the search method in App.js to the state of term
  search() {
    if(this.state.term === ''){
       this.setState({ error: 'Serch field can\'t be empty' }); 
    }
    else{
        this.setState({ error: "" }); 
        this.props.onSearch(this.state.term)
    }
  }
  
  // Sets the state of term to the value the user enters in input
  handleTermChange(event) {
    this.setState({ term: event.target.value });
  }

  handleKeyPress(event) {
    if(event.key === 'Enter') {
      this.search();
    }
  }
  
  render() {
    return(
      <div className="SearchBar">
        <input  placeholder="Enter A Song, Album, or Artist"
                onChange={this.handleTermChange}
                onKeyPress={this.handleKeyPress} />
                <p style={{ marginTop: "-1.5rem", paddingBottom: ".5rem", fontSize: "0.7rem", color: "red", fontWeight: "800"}}>{this.state.error}</p>
        <button  className="SearchButton" onClick={this.search}>SEARCH</button>
      </div>
    );
  }
}

export default SearchBar;