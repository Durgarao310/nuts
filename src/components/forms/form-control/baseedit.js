import React, { Fragment, useState, useEffect, useStateCallback } from 'react';
import Breadcrumb from '../../common/breadcrumb';
import {BasicFormControl,Submit,UploadFile} from '../../../constant'
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import { useParams } from 'react-router-dom'

const BaseEdit = ({ history }) => {
  const [price, setPrice] = useState("")
  const [weight, setWeight] = useState("")
  const [type, setType] = useState("")
  const [description, setDescription] = useState("")
  const [filename, setFilename] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const abortController = new AbortController();
  const [imgData, setImgData] = useState(null);

  const { id } = useParams()

  

    const onChangePicture = e => {
      if (e.target.files[0]) {
        console.log("picture: ", e.target.files);
        setImageUrl(e.target.files[0]);
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          setImgData(reader.result);
        });
        reader.readAsDataURL(e.target.files[0]);
      }
    };


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
            const rep = await axios.get(`http://localhost:7426/api/v1/admin/products/${id}`,{headers: {
              'Authorization':`Bearer ${localStorage.getItem("token")}`
            }})
            setPrice(rep.data.content.price) 
            setFilename(rep.data.content.filename)
            setWeight(rep.data.content.weight)
            setType(rep.data.content.type)
            setDescription(rep.data.content.description)
            setImageUrl(rep.data.content.url)
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
                  toast.error("Oppss... please reenter the data and Image uploaded is not of type jpg/jpeg  or png");
              }, 200);
            }
          }
    }
    pord()
    return function cleanup() {
        abortController.abort();
    };
},[])

  const formData = new FormData();
  formData.append('price', price);
  formData.append('type', type);
  formData.append('weight', weight);
  formData.append('description', description);
  formData.append('filename', filename);
  formData.append('imageUrl', imageUrl);



  const config = {
    headers: {
      'Content-Type': `application/x-www-form-urlencoded; boundary=${formData._boundary}`,
      'Authorization':`Bearer ${localStorage.getItem("token")}`
    }
   }

  // Handles file upload event and updates state
    const submitProduct = async (e) => {
      e.preventDefault()
      try {
          setLoading(true)
          const products = await axios.patch(`http://localhost:7426/api/v1/admin/products/${id}`, formData,config)
          history.push(`${process.env.PUBLIC_URL}/products`);
          window.location.reload();
          setTimeout(() => {
            setLoading(false)
          }, 2000);
          setDescription("")
          setFilename("")
          setWeight("")
          setPrice("")
          setType("")
          setImageUrl(null)
          setLoading(false)
      } catch (error) {
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
              toast.error("Oppss... please reenter the data and Image uploaded is not of type jpg/jpeg  or png");
          }, 200);
        }
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
                <h5>Update The Product</h5>
              </div>
              <form onSubmit={submitProduct} className="form theme-form">
                <div className="card-body">
                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="exampleFormControlInput1">Price</label>
                        <input className="form-control" type="number" name="price"
                        autoComplete="off"
                                                            value={price}
                                                            onChange={e => setPrice(e.target.value)}
                                                        required/>                     
                                                         </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="exampleFormControlInput1">FileName</label>
                        <input className="form-control" type="text" name="filename"
                        autoComplete="off"
                                                            value={filename}
                                                            onChange={e => setFilename(e.target.value)}
                                                        required/>                     
                                                         </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <div className="form-group row">
                        <label className="col-sm-3 col-form-label">{UploadFile}</label>
                        <img style={{height:"20rem", width:"20rem", borderRadius:"3%",  boxShadow: "0.1rem 0.3rem 0.2rem #a39696" , margin: "1rem"}} src={imgData || imageUrl}></img>
                        <div className="col-sm-9">
                        <input name="imageUrl" 
                        autoComplete="off"
                              id="customFile" type="file" onChange={onChangePicture}
                                                        />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="exampleFormControlSelect9">Weight</label>
                        <input className="form-control" type="number" name="weight"
                        autoComplete="off"
                                                            value={weight}
                                                            onChange={e => setWeight(e.target.value)}
                                                        required/>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="exampleFormControlSelect3">Category</label>
                        <input className="form-control" type="text" name="type"
                        autoComplete="off"
                                                            value={type}
                                                            onChange={e => setType(e.target.value)}
                                                        required/>

                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="exampleFormControlSelect3">Description</label>
                        <input className="form-control" type="text" name="description"
                        autoComplete="off"
                                                            value={description}
                                                            onChange={e => setDescription(e.target.value)}
                                                        required/>

                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer">
  

                {loading ?  <button className="btn btn-primary mr-1">
                                  <i className="fa fa-spinner fa-spin"></i>Loading...
                            </button> : 
                            <button className="btn btn-primary mr-1" type="submit">
                               Save
                            </button>
                }
                </div>
              </form>
            </div>
           
          </div>
        </div>
      </div>
}
    </Fragment>
  );
};

export default BaseEdit;