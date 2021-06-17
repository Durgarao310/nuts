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

const BasicTables = ({history}) =>{
    const [products, setProducts]= useState([])
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
                const rep = await axios.get("http://localhost:7426/api/v1/item/",
                config
                )
          
                setProducts(rep.data.content)
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

    const removeData = async (id) => {
        setLoading(true)
        let url = `http://localhost:7426/api/v1/item/${id}`
        await axios.delete(url,
            config
            ).then(res => {
            setProducts(products.filter(product => id !== product._id))
            setLoading(false)
        })
        .catch((error) => {
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
        });
    }

    const allproducts= ()=>{
        const pord = async()=>{
            try{
                setLoading(true)
                const rep = await axios.get("http://localhost:7426/api/v1/item/",
                config
                )
                setProducts(rep.data.content)
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
    }

    const searchItem =()=>{
        if(!search){
            setTimeout(() => {
                toast.error("Oppss... please enter the  product id ");
            }, 200);
        }
        if(search.length > 0 && (products.filter(product => search== product._id)).length == 0 ){
            setTimeout(() => {
                toast.error("Oppss... no product found with this is id");
            }, 200);
            setProducts(products)
            setSearch("")
        }
        if(search.length > 0 && (products.filter(product => search== product._id)).length > 0){
            setProducts(products.filter(product => search== product._id)) 
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
                                <h5 className="m-1">Products</h5>
                                        <div className="input-group">
                                            <input type="text" className="form-control rounded m-1" placeholder="Search" aria-label="Search"
                                                value={search}
                                                onChange={e => setSearch(e.target.value)}
                                                aria-describedby="search-addon" />
                                            <button type="submit" className="btn btn-outline-info btn-sm m-1" onClick={searchItem}>Search</button>
                                            <button type="submit" className="btn btn-outline-info btn-sm m-1" onClick={allproducts} ><i className="material-icons" style={{fontSize : "24px", color:"red", display: "center"}}>refresh</i></button>
                                        </div>
                            </div>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">{"#"}</th>
                                            <th scope="col">{"Name"}</th>
                                            <th scope="col">{"Image"}</th>
                                            <th scope="col">{"Product Id"}</th>
                                            <th scope="col">{"Description"}</th>
                                            <th scope="col">{"Price"}</th>
                                            <th scope="col">{"Weight"}</th>
                                            <th scope="col">{"Category"}</th>
                                            <th scope="col">{""}</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                    {products.map(((item, index) => 
                                        <tr key={item._id}>
                                            <td scope="col">{index+1}</td>
                                            <td scope="col">{item.filename}</td>
                                            <td scope="col"><img style={{height:"10rem", width:"10rem", borderRadius:"5%",  boxShadow: "0.1rem 0.3rem 0.2rem #a39696" }} src={item.url}></img> </td>
                                            <td scope="col">{item._id}</td>
                                            <td scope="col">{item.description}</td>
                                            <td scope="col">Rs: {item.price}</td>
                                            <td scope="col">{item.weight} g</td>
                                            <td scope="col">{item.type}</td>
                                            <td scope="col"> 
                                                        <Link
                                                            to={`${process.env.PUBLIC_URL}/edit-product/${item._id}`}
                                                            title="Edit Employee">
                                                            <button className="btn btn-outline-info btn-sm m-1"><i className="fa fa-pencil"></i></button>
                                                        </Link>   
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
                                                        </button>                                             </td>
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
        
export default BasicTables;