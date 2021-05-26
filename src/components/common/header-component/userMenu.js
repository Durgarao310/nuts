import React, { Fragment, useState, useEffect } from 'react';
import man from '../../../assets/images/dashboard/user.png';
import {  LogOut } from 'react-feather';
import {firebase_app} from "../../../data/config";
import { withRouter } from 'react-router';
import {useAuth0} from '@auth0/auth0-react'

const UserMenu = ({ history }) => {

    const [profile, setProfile] = useState('');
    // auth0 profile
    const {logout} = useAuth0()
    const authenticated = JSON.parse(localStorage.getItem("authenticated"))

    useEffect(() => {
        setProfile(localStorage.getItem('profileURL') || man);
    }, []);

    const Logout_From_Firebase = () => {
        localStorage.removeItem('profileURL')
        localStorage.removeItem('token');
        firebase_app.auth().signOut()
        history.push(`${process.env.PUBLIC_URL}/login`)
    }

    const  Logout_From_Auth0 = () =>  {
        localStorage.removeItem("auth0_profile")
        localStorage.setItem("authenticated",false)
        history.push(`${process.env.PUBLIC_URL}/login`)
        logout()
    }

    return (
        <Fragment>
            <li className="onhover-dropdown">
                <div className="media align-items-center">
                    <h4 className="align-self-center pull-right img-50 rounded-circle blur-up lazyloaded">{profile.slice(0,3)}...</h4>
                    <div className="dotted-animation">
                        <span className="animate-circle"></span>
                        <span className="main-circle"></span>
                    </div>
                </div>
                <ul className="profile-dropdown onhover-show-div p-20 profile-dropdown-hover">
                    <li><a onClick={authenticated ? Logout_From_Auth0 : Logout_From_Firebase} href="#javascript" ><LogOut /> {"Log out"}</a></li>
                </ul>
            </li>
        </Fragment>
    );
};


export default withRouter(UserMenu);