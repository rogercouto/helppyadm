import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Welcome from './pages/Welcome';
import Posts from './pages/Posts';
import PostForm from './pages/PostForm';
import Feels from './pages/Feels';
import Infos from './pages/Infos';

export default function Routes(){
    
    return(
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Welcome} />
                <Route path="/posts" exact component={Posts} />
                <Route path="/posts/form" exact component={PostForm} />
                <Route path="/feels" component={Feels} />
                <Route path="/infos" component={Infos} />
            </Switch>
        </BrowserRouter>
    );
}