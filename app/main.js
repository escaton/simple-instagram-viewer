'use strict';

import Promise from 'bluebird';
import React from 'react';
import { render } from 'react-dom';
import * as url from 'url';
import $ from 'jquery';
import Gallery from './gallery';

import mainStyle from './main.css';
import auth from './auth';

class App extends React.Component {

    constructor() {
        super();
        this.state = {
            showUser: 'love', // the only option for sandboxed app
            token: null
        }
    }

    componentDidMount() {
        this
            .authorize()
            .then(this.storeToken.bind(this))
            .then(this.loadImages.bind(this))
    }

    storeToken(token) {
        return new Promise((resolve) => {
            this.setState({ token }, resolve);
        });
    }

    loadImages() {
        this.callAPI('tags/' + this.state.showUser + '/media/recent')
            .then((images) => {
                console.log(images);
                this.setState({
                    images: images.data
                });
            }, (e) => {
                console.error('error', e)
            });
    }

    callAPI(endpoint) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: url.format({
                    protocol: 'https:',
                    host: 'api.instagram.com',
                    pathname: '/v1/' + endpoint,
                    query: {
                        access_token: this.state.token
                    }
                }),
                type: 'GET',
                crossDomain: true,
                dataType: 'jsonp',
                success: (data) => {
                    resolve(data);
                },
                error: (e) => {
                    reject(e);
                }
            });
        });
    }

    buildAuthorizeURL() {
        return url.format({
            protocol: 'https:',
            host: 'api.instagram.com',
            pathname: '/oauth/authorize/',
            query: {
                client_id: auth.instagramClientId,
                redirect_uri: window.location.href,
                response_type: 'token',
                scope: 'public_content'
            }
        });
    }

    authorize() {
        var hash = url.parse(window.location.href).hash || '';
        var tokenMatch = hash.match(/access_token=(.+)$/);
        var token = tokenMatch && tokenMatch[1];

        return new Promise((resolve, reject) => {
            if (!token) {
                window.location.href = this.buildAuthorizeURL();
            } else {
                resolve(token);
            }
        });
    }

    render() {
        var content;
        if (this.state.images) {
            content = <Gallery images={ this.state.images } />
        }
        return <div>{ content }</div>
    }
}

render(<App />, document.getElementById('root'));
