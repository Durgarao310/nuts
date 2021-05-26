import React, { useEffect,useState } from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import {firebase_app,auth0} from './data/config';
import { configureFakeBackend ,authHeader, handleResponse } from "./services/fack.backend";
import { BrowserRouter, Switch, Route,Redirect } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';

// ** Import custom components for redux **
import { Provider } from 'react-redux';
import store from './store';
import App from "./components/app";
import { Auth0Provider } from '@auth0/auth0-react'

// forms 
import FormValidation from './components/forms/form-control/form-validation';
import BaseInput from './components/forms/form-control/baseInput';
import BaseEdit from './components/forms/form-control/baseedit';


// tables 
import BasicTable from './components/tables/bootstrap/basicTable';
import Users from './components/tables/bootstrap/usersTable';


import DataTableComponent from './components/tables/dataTableComponent';

// users
import UserProfile from './components/users/userProfile';

// coupons
import Coupons from './components/coupons/coupons';


// pages 
import Login from './pages/login';
import Signup from './pages/signup';

import Error400 from './pages/errors/error400';
import Error401 from './pages/errors/error401';
import Error403 from './pages/errors/error403';
import Error404 from './pages/errors/error404';
import Error500 from './pages/errors/error500';
import Error503 from './pages/errors/error503';


import Signin from './auth/signin';
import jwt_decode from "jwt-decode";

//config data
import configDB from './data/customizer/config'

import Callback from './auth/callback'
import { useHistory } from "react-router-dom";

// setup fake backend
configureFakeBackend();


const Root = () => {

    const abortController = new AbortController();
    const [currentUser, setCurrentUser] = useState(false);
    const [authenticated,setAuthenticated] = useState(false)
    let history = useHistory();

    let jwt_token = localStorage.getItem('token');
    useEffect(()=>{
        if(localStorage.getItem('token') === 'undefined'){
            jwt_token = false;
        } 
        if(jwt_token){
            const { exp } = jwt_decode(jwt_token)
           const expirationTime = (exp * 1000) - 60000
           if (Date.now() >= expirationTime) {
               localStorage.clear();
               jwt_token = false;
               window.location.reload()
           }
        }
        else {
            jwt_token = localStorage.getItem('token')
        }
    },[jwt_token])

    // let token = localStorage.getItem('token')
    // useEffect(()=>{
    //    const { exp } = jwt_decode(token)
    //    const expirationTime = (exp * 1000) - 60000
    //    if (Date.now() >= expirationTime) {
    //        localStorage.clear();
    //        history.push(`${process.env.PUBLIC_URL}/login`);
    //    }
    // },[])


    useEffect(() => {

        const requestOptions = { method: 'GET', headers: authHeader() };
        fetch('/users', requestOptions).then(handleResponse)
        const color = localStorage.getItem('color')
        console.log(color);
        const layout = localStorage.getItem('layout_version') || configDB.data.color.layout_version
        firebase_app.auth().onAuthStateChanged(setCurrentUser);
        setAuthenticated(JSON.parse(localStorage.getItem("authenticated")))
        document.body.classList.add(layout);
        console.ignoredYellowBox = ['Warning: Each', 'Warning: Failed'];
        console.disableYellowBox = true;
        document.getElementById("color").setAttribute("href", `${process.env.PUBLIC_URL}/assets/css/${color}.css`);
        
        return function cleanup() {
            abortController.abort();
        }
        
    // eslint-disable-next-line
    }, []);

    return (
        <div className="App">
            <Auth0Provider domain={auth0.domain} clientId={auth0.clientId} redirectUri={auth0.redirectUri}>
            <Provider store={store}>
                <BrowserRouter basename={`/`}>
                        <Switch>
                            <Route path={`${process.env.PUBLIC_URL}/login`} component={Signin} />
                            <Route path={`${process.env.PUBLIC_URL}/pages/login`} component={Login} />
                            <Route path={`${process.env.PUBLIC_URL}/pages/signup`} component={Signup} />
                            <Route path={`${process.env.PUBLIC_URL}/pages/errors/error400`} component={Error400} />
                            <Route path={`${process.env.PUBLIC_URL}/pages/errors/error401`} component={Error401} />
                            <Route path={`${process.env.PUBLIC_URL}/pages/errors/error403`} component={Error403} />
                            <Route path={`${process.env.PUBLIC_URL}/pages/errors/error404`} component={Error404} />
                            <Route path={`${process.env.PUBLIC_URL}/pages/errors/error500`} component={Error500} />
                            <Route path={`${process.env.PUBLIC_URL}/pages/errors/error503`} component={Error503} />
                            <Route  path={`${process.env.PUBLIC_URL}/callback`} render={() => <Callback/>} />
                            {currentUser !== null || authenticated || jwt_token ?
                            
                                <App>
                                    {/* dashboard menu */}
                                    <Route exact path={`${process.env.PUBLIC_URL}/`} render={() => {
                                        return (<Redirect to={`${process.env.PUBLIC_URL}/orders`} />)
                                    }} />

                                    {/* Forms */}
                                    <Route path={`${process.env.PUBLIC_URL}/forms-controls/form-validation`} component={FormValidation} />
                                    <Route path={`${process.env.PUBLIC_URL}/create-product`} component={BaseInput} />
                                    <Route path={`${process.env.PUBLIC_URL}/edit-product/:id`} component={BaseEdit} />                                   

                                    {/* Tables */}
                                    <Route path={`${process.env.PUBLIC_URL}/orders`} component={DataTableComponent} />
                                    <Route path={`${process.env.PUBLIC_URL}/products`} component={BasicTable} />
                                    <Route path={`${process.env.PUBLIC_URL}/users`} component={Users} />

                                    {/* Users */}
                                    <Route path={`${process.env.PUBLIC_URL}/users/userProfile`} component={UserProfile} />

                                    {/* coupons */}
                                    <Route path={`${process.env.PUBLIC_URL}/coupons`} component={Coupons} />


                         </App>
                             :
                                <Redirect to={`${process.env.PUBLIC_URL}/login`} />
                            } 
                        </Switch>
                </BrowserRouter>
            </Provider>
            </Auth0Provider>
        </div>
    );
}

ReactDOM.render(<Root />, document.getElementById('root'));

serviceWorker.unregister();