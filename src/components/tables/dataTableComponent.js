import React, { Fragment} from 'react';
import {useState, useEffect} from "react";
import Breadcrumb from '.././common/breadcrumb';
import axios from "axios"
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const DataTableComponent = ({history}) => {
  const [orders, setOrders]= useState([])
  const [loading, setLoading] = useState(false)
  const abortController = new AbortController();
  const MySwal = withReactContent(Swal)
  const [products, setProducts]= useState([])
  const [status, setStatus]= useState(null)
  const [search, setSearch] = useState("")


  let config = {
    headers: {
      'Authorization':`Bearer ${localStorage.getItem("token")}`,
      'Content-Type': 'application/json;charset=UTF-8',
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
  const data = {
    "brand": "goodboy",
    "cust_name": "Toncy John",
    "cust_details": {
      "email": "contact@toncyz.com",
      "address": "Bandlaguda, Hyderabad",
      "contact": "9381064750"
    },
    "start_date": "30 Aug, 2020",
    "line_items": [
      {
        "item": "Mini - 10 Days | Aug 2020",
        "quantity": "1",
        "amount": "2200"
      },
      {
        "item": "Small - 10 Days | Aug 2020",
        "quantity": "1",
        "amount": "2000"
      },
      {
        "item": "Large - 10 Days | Aug 2020",
        "quantity": "1",
        "amount": "3000"
      }
    ]
  }

    useEffect(()=>{
        const prd = async()=>{
            try{
              setLoading(true)
                const rep = await axios.get("http://localhost:8080/api/v1/admin/products",
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
                      toast.error("Oppss... please refresh the page");
                  }, 200);
                }
            }
            setLoading(false)

        }
        prd()
        return function cleanup() {
            abortController.abort();
        };
    },[])



  useEffect(()=>{
      const p = async()=>{
          setLoading(true)
          try{
              const rep = await axios.get("http://localhost:8080/api/v1/admin/orders",
              config
              )
              setOrders(rep.data.content)
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
                    toast.error("Oppss... please refresh the page");
                }, 200);
              }
            }
            setLoading(false)

      }
      p()
      return function cleanup() {
          abortController.abort();
      };
  },[])

    const por = async(e)=>{
      e.preventDefault();
        var username = 'geethakrishna@wielabs.com';
        var password = 'geetha123';
        var credentials = btoa(username + ':' + password);
        var basicAuth = 'Basic ' + credentials;
        try{
          setLoading(true)
            const rep = await axios.post("https://invoice.wielabs.com/api/v1/genInvoice",
            data,
            {
              responseType: 'arraybuffer',
              headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/pdf',
                  "Authorization": basicAuth
              }
          });
          setLoading(false)
          const url = window.URL.createObjectURL(new Blob([rep.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'file.pdf'); //or any other extension
          document.body.appendChild(link);
          link.click();
        }
        catch (error) {
          console. log(error)
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
                  toast.error("Oppss... please try again");
              }, 200);
            }
        }
        setLoading(false)

    }
        

    const update = async(id)=>{
      if(!status){
        const val = orders.filter(s =>s._id==`${id}`).map(k => k.status)
        console.log(val[0])
        return toast.error("Oppss... please change the order status!");
      }
      try {
        setLoading(true)
        const res = await axios.patch(`http://localhost:8080/api/v1/admin/orders/${id}`,
        {status},config)
        allorders();
        setTimeout(()=>{
          setLoading(false)
        },1000)
        setStatus("")
      } catch (error) {
        setStatus("")
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
              toast.error("Oppss... please change again the order status");
          }, 200);
        }
      }
      setStatus("")
    }


  const prdname =(id)=>{
    products.filter(e =>e._id==id).map(a => a.name)
  }
  prdname()

  const allorders = ()=>{
        const p = async()=>{
          setLoading(true)
          try{
              const rep = await axios.get("http://localhost:8080/api/v1/admin/orders",
              config
              )
              setOrders(rep.data.content)
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
                    toast.error("Oppss... please refresh the page");
                }, 200);
              }
            }
            setLoading(false)

      }
      p()
  }

  const searchItem =()=>{
    if(!search){
        setTimeout(() => {
          toast.error("Oppss... please enter the  product id ");
      }, 200);
    }
    if(search.length > 0 && (orders.filter(product => search== product._id)).length == 0 ){
        setTimeout(() => {
            toast.error("Oppss... no orders found with this is id");
        }, 200);
        setSearch("")
    }
    if(search.length > 0 && (orders.filter(product => search== product._id)).length > 0){
        setOrders(orders.filter(product => search== product._id)) 
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
                        <h5 className="m-1">Orders</h5>
                            <div className="input-group">
                                <input type="text" className="form-control rounded m-1" placeholder="Search" aria-label="Search"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    aria-describedby="search-addon" />
                                <button type="submit" className="btn btn-outline-info btn-sm m-1" onClick={searchItem}>Search</button>
                                <button type="submit" className="btn btn-outline-info btn-sm m-1" onClick={allorders} >All Orders</button>
                            </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">{"#"}</th>
                                    <th scope="col">{"Order Id"}</th>
                                    <th scope="col">{"Name"}</th>
                                    <th scope="col">{"TotalAmount"}</th>
                                    {/* <th scope="col">{"Address"}</th> */}
                                    <th scope="col">{"Phone"}</th>
                                    <th scope="col">{"statue"}</th>
                                    <th scope="col">{""}</th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                            {orders.map(((item, index) =>
                                <tr key={item._id}>
                                    <td scope="col">{index+1}</td>
                                    <td scope="col">{item._id}</td>
                                    <td scope="col">{item.name}</td>
                                    <td scope="col">{item.totalAmount}</td>
                                    {/* <td scope="col">{item.address}</td> */}
                                    <td scope="col">{item.phone}</td>
                                    <td scope="col">
                                    <div className="select2-drpdwn-project select-options">
                                    <select className="form-control form-control-primary btn-square" onChange={(e)=>setStatus(e.target.value)} defaultValue={item.status} required>
                                      <option value="waiting">waiting</option>
                                      <option value="confirmed">confirmed</option>
                                      <option value="deliver">deliver</option>
                                      <option value="success">success</option>
                                      <option value="cancelled">cancelled</option>
                                    </select>
                                    </div>
                                    </td>
                                    <td scope="col"> 
                                    <button className="btn btn-outline-info btn-sm m-1" onClick={()=>update(item._id)}><i className="fa fa-pencil"></i></button>
                                    <button className="btn btn-outline-info btn-sm m-1" onClick={por}><i className="fa fa-book"></i></button>
                                    <button onClick={()=>{MySwal.fire({
                                                width: '90%',
                                                html: 
                                                 <div className="table-responsive">
                                                  <table className="table">
                                                  <thead className="thead-light">
                                                    <tr>
                                                      <th scope="col">Order Id</th>
                                                      <th scope="col">Name</th>
                                                      <th scope="col">Items</th>
                                                      <th scope="col">Price</th>
                                                      <th scope="col">Quantity</th>
                                                      <th scope="col">Address</th>
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    <tr>
                                                      <td scope="col">{item._id}</td>
                                                      <td>{item.name}</td>
                                                      <td>{item.items.map(
                                                        prod =>( <p>
                                                          {products.filter(e =>e._id==prod.item).map(a => a.filename)}
                                                        </p>)
                                                      )}</td>
                                                      <td>{item.items.map(
                                                        prod =>( <p>
                                                          {products.filter(e =>e._id==prod.item).map(a => a.price)}
                                                        </p>)
                                                      )}</td>
                                                      <td>{item.items.map(
                                                        prod =>( <p>
                                                          {prod.quantity}
                                                        </p>)
                                                      )}</td>
                                                      <td>{item.address}</td>
                                                    </tr>
                                                     <tr>
                                                       <td></td>
                                                       <td></td>
                                                       <td>Total Amount : </td>
                                                       <td>{item.totalAmount}</td>
                                                       <td></td>
                                                       <td></td>
                                                       </tr>
                                                    {/* <h6>Total amount: {item.totalAmount}</h6> */}
                                                  </tbody>
                                                </table>
                                               </div>
                                              })}} 
                                        className="btn btn-outline-info btn-sm m-1"><i className="fa fa-info">nfo</i></button>                                     
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
export default DataTableComponent;