import React, { useState, useEffect, useHistory } from 'react';
import logo from '../assets/images/endless-logo.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { withRouter } from "react-router";
import { LOGIN,YourName,Password,RememberMe} from '../constant';
import axios from "axios"

const Signin = ({history}) => {
    const abortController = new AbortController();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (localStorage.getItem("token")) {
            return history.push(`${process.env.PUBLIC_URL}/orders`);
        }
        return function cleanup() {
            abortController.abort();
        }
    }, [history]);

    const [value, setValue] = useState(
        localStorage.getItem('profileURL')
    );

    useEffect( async() => {
        if (value !== null)
            return await localStorage.setItem('profileURL', value);
        return function cleanup() {
            abortController.abort();
        };
    }, [value]);
 

 
    const loginWithJwt = async (e) => {
        setLoading(true)
        e.preventDefault()
        try {
            const user = await axios.post("http://localhost:7426/api/v1/admin/login",{email, password})
            setValue(user.data.name);
            localStorage.setItem("token", user.data.token)
            window.location = (`${process.env.PUBLIC_URL}/orders`);
            window.location.reload()
        } catch (error) {
            setTimeout(() => {
                toast.error("Oppss.. The password is invalid or the user does not have a password.");
            }, 200);
        }
        setPassword("")
        setEmail("")
        setLoading(false)
      }

    return (
        <div>
            <div className="page-wrapper">
                <div className="container-fluid p-0">
                    {/* <!-- login page start--> */}
                    <div className="authentication-main">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="auth-innerright">
                                    <div className="authentication-box">
                                        <div className="text-center">
                                            <img src={logo} alt="" /></div>
                                        <div className="card mt-4">

                                            <div className="card-body">
                                                <div className="text-center">
                                                    <h4>{LOGIN}</h4>
                                                    <h6>{"Enter your Email and Password"} </h6>
                                                </div>
                                                <form onSubmit={loginWithJwt} className="theme-form" >
                                                    <div className="form-group">
                                                        <label className="col-form-label pt-0">Email</label>
                                                        <input className="form-control" type="email" name="email"
                                                            value={email}
                                                            onChange={e => setEmail(e.target.value)}
                                                            placeholder="example@gmail.com"
                                                        required/>
                                                       
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="col-form-label">{Password}</label>
                                                        <input className="form-control" type="password" name="password"
                                                            value={password}
                                                            placeholder="*******"
                                                            onChange={e => setPassword(e.target.value)} required/>
                                                        
                                                    </div>
                                                    <div className="checkbox p-0">
                                                        <input id="checkbox1" type="checkbox" />
                                                    </div>
                                                    <div className="form-group form-row mt-3 mb-0">
                                                    {loading ? <button className="btn btn-secondary btn-block">
                                                                     <i className="fa fa-spinner fa-spin"></i>Loading...
                                                                </button> 
                                                                 : 
                                                                <button className="btn btn-secondary btn-block" type="submit" >
                                                                     {LOGIN}
                                                                </button>
                                                    }
                                                    </div>
                                                    <div className="form-group form-row mt-3 mb-0 button-auth">
                                                    </div>
                    
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ToastContainer />
                    {/* <!-- login page end--> */}
                </div>
            </div>
        </div>
    );
};

export default withRouter(Signin);