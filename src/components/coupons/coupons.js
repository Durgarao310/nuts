import React, { Fragment} from 'react';
import {useState, useEffect} from "react";
import Breadcrumb from '../common/breadcrumb';
import axios from "axios"
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'react-toastify';
import {
    Link
  } from "react-router-dom";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const Coupons = ({history}) =>{
    const [coupons, setCoupons]= useState([])
    const [loading, setLoading] = useState(false)
    const abortController = new AbortController();
    const [search, setSearch] = useState("")
    const MySwal = withReactContent(Swal)
    const [err, setErr]= useState(false)


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

      if(err){
        setTimeout(() => {
            toast.error("Oppss... please login again");
        }, 200)
        setErr(false)
      }   

      useEffect(()=>{
        const pord = async()=>{
            try{
                setLoading(true)
                const rep = await axios.get(`http://localhost:7426/api/v1/coupon/admin`,
                config
                )
                setCoupons(rep.data.content)
            }
            catch (error) {
                  setLoading(false)
                  if(error.response.status == 401){
                    localStorage.clear()
                    setErr(true)
                    history.push(`${process.env.PUBLIC_URL}/login`)
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

    

    const getallcoupons =()=>{
            const pord = async()=>{
                try{
                    setLoading(true)
                    const rep = await axios.get("http://localhost:7426/api/v1/coupon/admin", config)
                    setCoupons(rep.data.content)
                    setLoading(false)
                }
                catch (error) {
                    setLoading(false)
                    if(error.response.status == 401){
                        localStorage.clear()
                        setErr(true)
                        history.push(`${process.env.PUBLIC_URL}/login`)
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


    const removeData = async (id) => {
        setLoading(true)
        let url = `http://localhost:7426/api/v1/coupon/${id}`
        await axios.delete(url,
            config
            ).then(res => {
            setCoupons(coupons.filter(product => id !== product._id))
            setLoading(false)
        })
        .catch((error) => {
            setLoading(false)
            if(error.response.status == 401){
                localStorage.clear()
                setErr(true)
                history.push(`${process.env.PUBLIC_URL}/login`)
              }
              else{
                setTimeout(() => {
                    toast.error("Oppss... please refresh the page and try again");
                }, 200);
              }
        });
    }

    // const searchItem =()=>{
    //     if(!search){
    //         setTimeout(() => {
    //             toast.error("Oppss... please enter the user id!");
    //         }, 200);
    //     }
    //     if(search.length > 0 && (coupons.filter(coupon => search== coupon._id)).length == 0 ){
    //         setTimeout(() => {
    //             toast.error("Oppss... no user found with this is id");
    //         }, 200);
    //         setSearch("")
    //     }
    //     if(search.length > 0 && (coupons.filter(coupon => search== coupon._id)).length > 0){
    //         setCoupons(coupons.filter(product => search== product._id)) 
    //         setSearch("")
    //     }
    // }
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
                                <h5 className="m-1">Coupons</h5>
                                        {/* <div className="input-group">
                                            <input type="text" className="form-control rounded m-1" placeholder="Search" aria-label="Search"
                                                value={search}
                                                onChange={e => setSearch(e.target.value)}
                                                aria-describedby="search-addon" />
                                            <button type="submit" className="btn btn-outline-info btn-sm m-1" onClick={searchItem}>Search</button>
                                            <button type="submit" className="btn btn-outline-info btn-sm m-1" onClick={getallcoupons} >All Users</button>
                                        </div> */}
                            </div>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">{"#"}</th>
                                            <th scope="col">{"Coupon"}</th>
                                            <th scope="col">{"Price"}</th>
                                            <th scope="col">{"End Date"}</th>
                                            <th scope="col">{"Description"}</th>
                                            <th scope="col">{""}</th>
                                            
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {coupons.map(((item, index) => 
                                        <tr key={item._id}>
                                            <td scope="col">{index+1}</td>
                                            <td scope="col"><mark  className="bg-dark text-white">{item.coupon}</mark></td>
                                            <td scope="col">Rs: {item.price}</td>
                                            <td scope="col">{item.endDate}</td>
                                            <td scope="col">{item.description}</td>
                                            <td scope="col"> 
                                                <button onClick={()=>{Swal.fire({
                                                        title: 'Are you sure?',
                                                        text: "You won't be able to revert this!",
                                                        icon: 'warning',
                                                        showCancelButton: true,
                                                        confirmButtonColor: '#3085d6',
                                                        cancelButtonColor: '#d33',
                                                        confirmButtonText: 'Yes, delete it!',
                                                        }).then((result) => {
                                                        if (result.isConfirmed) {
                                                            removeData(item._id)
                                                        }
                                                        })}} 
                                                        className="btn btn-outline-info btn-sm m-1"><i className="fa fa-trash"></i>
                                                </button>                                            
                                             </td>
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
        
export default Coupons;