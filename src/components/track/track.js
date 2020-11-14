import React from 'react';
import './track.css';
import ReactTooltip from "react-tooltip";

class Track extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            currentlyPlaying: false,
        };
        this.audio = new Audio(this.props.track.preview)
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.togglePlayPreview = this.togglePlayPreview.bind(this);
        this.renderPreviewIcon = this.renderPreviewIcon.bind(this);
    }
    
    // Adds this.props.track as an argument to the addTrack method in App.js
    addTrack() {
        
        this.props.onAdd(this.props.track);
    }

    // Adds this.props.track as an argument to the removeTrack method in App.js
    removeTrack() {
        this.props.onRemove(this.props.track);
    }
    
    // Renders either a + or a - link to add or remove tracks from playlist.
    renderAction() {
        
        if (this.props.isRemoval) {
            
            return <button className="Track-action" data-tip="Remove From Playlist"
                        onClick={this.removeTrack}>-</button>
                    
        }
        return <button className="Track-action" data-tip="Add to Playlist"
                        onClick={this.addTrack}>+</button>
    }

    togglePlayPreview() {
        
        if (!this.state.currentlyPlaying) {
            this.audio.play();
            this.audio.loop = true;
            this.setState({ 
                currentlyPlaying: true, 
            });
        } else {
            this.audio.pause();
            this.setState({ 
                currentlyPlaying: false,
            });
        }
    }


    renderPreviewIcon() {
        if(this.props.track.preview) {
            if (!this.state.currentlyPlaying) {
                return (
                    <i  className="fa fa-play Track-preview-icon" 
                        aria-hidden="true" 
                        data-tip="Preview 30 sec song"
                        style={{padding:"10px 10px"}}
                        onClick={this.togglePlayPreview}></i>
                );
            } else {
                return (
                        <i  className="fa fa-pause Track-preview-icon" 
                            aria-hidden="true" 
                            data-tip="stop/pause song preview"
                            style={{padding:"10px 10px"}}
                            onClick={this.togglePlayPreview}></i>
                );
            }
        } else {
            return <p className="Track-preview-unavailable">No <br/> Preview <br />Available</p>
        }
    }
    
    
    render() {
        return(
            <div className="Track" key={this.props.track.id}>
                <div className="Track-cover-preview">
                    
                    <div className="Track-preview-container">
                        {this.renderPreviewIcon()}
                    </div>
                    <img className="Track-album-cover" src={this.props.track.cover} alt="album cover"/>
                </div>
                <div className="Track-information">
                    <h3>{this.props.track.name}</h3>
                    <p>{this.props.track.artist} | {this.props.track.album}</p>
                </div>
                <ReactTooltip />
                {this.renderAction()}
            </div>
        );
    }
}

export default Track;