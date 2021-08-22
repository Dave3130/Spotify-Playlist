import React from 'react';
import './App.css';
import SearchBar from '../searchbar/searchbar';
import SearchResults from '../searchresults/searchresults';
import Playlist from '../playlist/playlist';

import Spotify from '../../util/Spotify';
require('dotenv').config()

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: []
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
  }
  
  // Adds track from Search Results to Playlist
  addTrack(track) {
    let tracks = this.state.playlistTracks;
    tracks.push(track);
    this.setState({ playlistTracks: tracks });
  }

  // Removes track from Playlist by filtering out track id from playlistTracks
  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter(current => current.id !== track.id);
    this.setState({ playlistTracks: tracks });
  }

  // Sends search term request to spotify and returns results of search in the search results panel
 search(term) {
    Spotify.search(term).then(searchResults => {
      this.setState({ searchResults: searchResults })
    });
  }

  // Updates the name of the Playlist
  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  // Saves playlist name and tracks to user's account
  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      });
    });
  }

  render() {
    return (
      <div>
        
        <div className="header">
        <h1 className="head-title">Spot<span className="highlight">ify Play</span>list <img src={require('./spotify.png')} alt="spotify-logo"/></h1>
          <button className="auth-btn" onClick={()=>{Spotify.getAccessToken()}} >Authenticate on Spotify</button>
        </div>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} 
                           onAdd={this.addTrack}/>
            <Playlist playlistName={this.state.playlistName} 
                      playlistTracks={this.state.playlistTracks}
                      onRemove={this.removeTrack}
                      onNameChange={this.updatePlaylistName}
                      onSave={this.savePlaylist}/>
          </div>
        </div>
        <p className="footer"><a href={"https://github.com/Dave3130"} rel={"noopener noreferrer"} target={"_blank"}><i className="fab fa-github"></i></a> &nbsp; Jaydeep Dave &nbsp; <a href={"https://www.linkedin.com/in/dave-jaydeep/"} target={"_blank"}><i className="fab fa-linkedin-in"></i></a></p>
        
      </div>
    );
  }
}

export default App;
