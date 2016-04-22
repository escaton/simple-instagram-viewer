'use strict';

import React from 'react';

import galleryStyle from './gallery.css';
import thumbStyle from './thumb.css';

class Thumbnail extends React.Component {
    constructor() {
        super();
        this.state = {
            loaded: false
        }
    }
    componentDidMount() {
        var i = new Image();
        i.onload = () => {
            this.setState({
                loaded: true
            });
        }
        i.src = this.props.image.images.thumbnail.url;
    }
    render() {
        var image = this.props.image;
        var background = {
            'backgroundImage': 'url(' + image.images.thumbnail.url + ')'
        };
        var className = [thumbStyle['thumb']];
        if (this.state.loaded) {
            className.push(thumbStyle['thumb_loaded_yes']);
        }
        return (
            <div className={ className.join(' ') } style={ background }>
                <div className={ thumbStyle['thumb__details'] }>
                    <span className={ thumbStyle['thumb__likes'] }>{ 'likes: ' + (image.likes.count || '—') }</span>
                    <span className={ thumbStyle['thumb__comments'] }>{ 'comments: ' + (image.comments.count || '—') }</span>
                </div>
            </div>
        )
    }
}

class Gallery extends React.Component {
    render() {
        var images = this.props.images;
        var content = images.map((image) => <Thumbnail key={ image.id } image={ image }/>);
        return <div className={ galleryStyle['gallery'] }>{ content }</div>
    }
}

export default Gallery;
