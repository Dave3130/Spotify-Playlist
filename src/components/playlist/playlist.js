import React from 'react';
import TrackList from '../tracklist/tracklist';
import './playlist.css';

class Playlist extends React.Component {
    constructor(props) {
        super(props);
        
        this.handleNameChange = this.handleNameChange.bind(this);
    }
    
    // Updates Playlist name to value user inputs
    handleNameChange(event) {
        this.props.onNameChange(event.target.value);
    }
    
    render() {
        return(
            <div className="Playlist">
                <input  defaultValue={this.props.playlistName}
                        onChange={this.handleNameChange}/>
                    <TrackList  tracks={this.props.playlistTracks}
                                isRemoval={true}
                                onRemove={this.props.onRemove}/>
                <button  className="Playlist-save" 
                    onClick={this.props.onSave} >SAVE TO SPOTIFY</button>
            </div>
        );
    }
}

export default Playlist;