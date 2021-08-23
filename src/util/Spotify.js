import Swal from 'sweetalert2';
//change redirectURi to your application url
const redirectUri = 'http://localhost:3000/';
let accessToken;

const Spotify = {

    // Gets access token from Spotify
    getAccessToken(query) {
        if(accessToken) {
            if(query !== 'search'){
                Swal.fire({
                    icon: 'warning',
                    title: 'Wait...',
                    text: 'You are already logged In !!',
                  })
                return null;
            }
            else{
                return accessToken;
            }
            
            
        }
        const hasAccessToken = window.location.href.match(/access_token=([^&]*)/);
        const hasExpiresIn = window.location.href.match(/expires_in=([^&]*)/);
        if (hasAccessToken && hasExpiresIn) {
            accessToken = hasAccessToken[1];
            const expiresIn = Number(hasExpiresIn[1]);
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Your session starts now !!',
              })
            return accessToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            window.location = accessUrl;
            
        }
        
    },

    
    
    // Uses access token to return a response from the Spoitify API using user serach term from SearchBar
    search(term) {
        const accessToken = Spotify.getAccessToken('search');
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(
            response => { 
                if (response.ok) {
                    return response.json();
                } else {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Oops...',
                        text: 'API request failed !!',
                    })
                }
        }).then(
            jsonResponse => {
            if(!jsonResponse.tracks) {
                return [];
            }
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri,
                cover: track.album.images[2].url,
                preview: track.preview_url
            }));
        });
    },

    // Gets a user's ID from Spotify, creates a new playlist on user's account, and adds tracks to that playlist
    savePlaylist(playlistName, trackURIs) {
        if (!playlistName || !trackURIs.length) {
            return;
        }
        if(accessToken === null){
            const accessToken = Spotify.getAccessToken();
        }
        const headers = {
            Authorization: `Bearer ${accessToken}`
        };
        let userId;

        // Return user's ID from Spotify API
        return fetch('https://api.spotify.com/v1/me', {
            headers: headers
        }).then(
            response => {
                if(response.ok) {
                    return response.json();
                } 
                else{
                    Swal.fire({
                        icon: 'warning',
                        title: 'Oops...',
                        text: 'API request failed !!',
                    })
                }
        }).then(
            jsonResponse => {
                userId = jsonResponse.id;

                // Adds playlist to user's account
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({name: playlistName})
                }).then(
                    response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Oops...',
                            text: 'API request failed !!',
                        })
                    }
                }).then(
                    jsonResponse => {
                        const playlistId = jsonResponse.id;
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: 'Your playlist is saved !!',
                          })
                        // Adds tracks to new playlist 
                        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
                            headers: headers,
                            method: 'POST',
                            body: JSON.stringify({ uris: trackURIs})
                        });
                    });
                    
            });
    }
}

export default Spotify;