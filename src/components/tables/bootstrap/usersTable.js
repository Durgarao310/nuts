import React, { Fragment} from 'react';
import {useState, useEffect} from "react";
import Breadcrumb from '../../common/breadcrumb';
import axios from "axios"
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'react-toastify';
import {
    Link
  } from "react-router-dom";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const Users = ({history}) =>{
    const [users, setUsers]= useState([])
    const [loading, setLoading] = useState(false)
    const abortController = new AbortController();
    const [search, setSearch] = useState("")
    const MySwal = withReactContent(Swal)

    let config = {
        headers: {
          'Authorization':`Bearer ${localStorage.getItem("token")}`
        }
      }

      useEffect(() => {
        if (!localStorage.getItem("token")) {
            history.push(`${process.env.PUBLIC_URL}/login`);
        }
        return function cleanup() {
          abortController.abort();
      };
      }, [history]);

      useEffect(()=>{
        const pord = async()=>{
            try{
                setLoading(true)
                const rep = await axios.get("http://localhost:7426/api/v1/user/users",
                config
                )
                console.log(rep)
                setUsers(rep.data)
            }
            catch (error) {
                  setLoading(false)
                  if(error.response.status == 401){
                    localStorage.clear()
                    window.location.reload()
                    setTimeout(() => {
                        toast.error("Oppss... please login again");
                    }, 200)
                  }
                  else{
                    setTimeout(() => {
                        toast.error("Oppss... please refresh the page and try again");
                    }, 200);
                  }
              }
              setLoading(false)
        }
        pord()
        return function cleanup() {
            abortController.abort();
        };
    },[])

    const getallusers =()=>{
            const pord = async()=>{
                try{
                    setLoading(true)
                    const rep = await axios.get("http://localhost:7426/api/v1/user/users", config)
                    console.log(rep)
                    setUsers(rep.data)
                    setLoading(false)
                }
                catch (error) {
                    setLoading(false)
                    if(error.response.status == 401){
                        localStorage.clear()
                        window.location.reload()
                        setTimeout(() => {
                            toast.error("Oppss... please login again");
                        }, 200)
                      }
                      else{
                        setTimeout(() => {
                            toast.error("Oppss... please refresh the page and try again");
                        }, 200);
                      }
                  }
            }
            pord()
            return function cleanup() {
                abortController.abort();
            };
    }

    const searchItem =()=>{
        if(!search){
            setTimeout(() => {
                toast.error("Oppss... please enter the user id!");
            }, 200);
        }
        if(search.length > 0 && (users.filter(product => search== product._id)).length == 0 ){
            setTimeout(() => {
                toast.error("Oppss... no user found with this is id");
            }, 200);
            setSearch("")
        }
        if(search.length > 0 && (users.filter(product => search== product._id)).length > 0){
            setUsers(users.filter(product => search== product._id)) 
            setSearch("")
        }
    }
    return (
        <Fragment>
        <Breadcrumb title="Basic Input" parent="Form" />
            {
            loading ? <i className="fa fa-spinner fa-spin" style={{fontSize: "4rem", color:"blue",margin: "0",
            position: "absolute",
            top: "50%",
            left: "50%"}}></i> :
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="m-1">Users</h5>
                                        <div className="input-group">
                                            <input type="text" className="form-control rounded m-1" placeholder="Search" aria-label="Search"
                                                value={search}
                                                onChange={e => setSearch(e.target.value)}
                                                aria-describedby="search-addon" />
                                            <button type="submit" className="btn btn-outline-info btn-sm m-1" onClick={searchItem}>Search</button>
                                            <button type="submit" className="btn btn-outline-info btn-sm m-1" onClick={getallusers} ><i className="material-icons" style={{fontSize : "24px", color:"red", display: "center"}}>refresh</i></button>
                                        </div>
                            </div>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">{"#"}</th>
                                            <th scope="col">{"Name"}</th>
                                            <th scope="col">{"User Id"}</th>
                                            <th scope="col">{"Email"}</th>
                                            <th scope="col">{"Phone"}</th>
                                            <th scope="col">{"Address"}</th>
                                            {/* <th scope="col">{"Profile Image"}</th> */}
                                            
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {users.map(((item, index) => 
                                        <tr key={item._id}>
                                            <td scope="col">{index+1}</td>
                                            <td scope="col">{item.name}</td>
                                            <td scope="col">{item._id}</td>
                                            {/* <td scope="col"><img style={{height:"10rem", width:"10rem", borderRadius:"5%",  boxShadow: "0.1rem 0.3rem 0.2rem #a39696" }} src={item.url}></img> </td> */}
                                            <td scope="col">{item.email}</td>
                                            <td scope="col">{item.phone}</td>
                                            <td scope="col">{item.address}</td>


                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
}
        </Fragment>

    );
              

};
        
export default Users;