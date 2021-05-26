import React, { Fragment, useState, useEffect, useStateCallback } from 'react';
import Breadcrumb from '../../common/breadcrumb';
import {BasicFormControl,BasicHTMLInputControl,EdgesInputStyle,FlatInputStyle,RaiseInputStyle,SolidInputStyle,InputSizing,CustomControls,
EmailAddress,Password,ExampleSelect,ExampleMultipleSelect,ExampleTextarea,Submit,SimpleInput,Placeholder,Date,Month, Time,ColorPicker,
LargeInput,SmallInput,MaximumLength,CustomSelect,Disabled,Textarea,StaticText,UploadFile,Telephone,DateAndTime,Week,Number,  
LargeSelect,DefaultSelect,SmallSelect,DefaultInput,URL} from '../../../constant'
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import ProdcutIma from '../../../assets/images/product.png';

const BaseInput = ({ history }) => {
  const [price, setPrice] = useState("")
  const [weight, setWeight] = useState("")
  const [type, setType] = useState(null)
  const [description, setDescription] = useState("")
  const [filename, setFilename] = useState("")
  const [imageUrl, setImageUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const abortController = new AbortController();
  const [imgData, setImgData] = useState(null);


  useEffect(() => {
    if (!localStorage.getItem("token")) {
        history.push(`${process.env.PUBLIC_URL}/login`);
    }
    return function cleanup() {
      abortController.abort();
  };
  }, [history]);

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
  const formData = new FormData();
  formData.append('price', price);
  formData.append('weight', weight);
  formData.append('type', type);
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
          if(!type){
            return toast.error("Oppss... please select the Category!");
          }
          setLoading(true)
          const products = await axios.post(`http://localhost:8080/api/v1/admin/products/post`, formData,config)
          setLoading(false)
          history.push(`${process.env.PUBLIC_URL}/products`);
      } catch (error) {
        console.log(error)
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
      setDescription("")
      setFilename("")
      setPrice("")
      setWeight("")
      setImageUrl(null)
      setLoading(false)
      setType("")

    }
     
  return (
    <Fragment>
      <Breadcrumb title="Basic Input" parent="Form" />
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header">
                <h5>Add New Product</h5>
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
                                                            placeholder="price"
                                                        required/>                     
                                                         </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="exampleFormControlInput1">Full Name</label>
                        <input className="form-control" type="text" name="filename"
                        autoComplete="off"
                                                            value={filename}
                                                            onChange={e => setFilename(e.target.value)}
                                                            placeholder="name of product"
                                                        required/>                     
                                                         </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <div className="form-group row">
                        <label className="col-sm-3 col-form-label">{UploadFile}</label>
                        <img style={{height:"20rem", width:"20rem", borderRadius:"3%",  boxShadow: "0.1rem 0.3rem 0.2rem #a39696" , margin: "1rem"}} src={imgData || ProdcutIma}></img>
                        <div className="col-sm-9">
                        <input  name="imageUrl"
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
                                                            placeholder="weight"
                                                        required/>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="exampleFormControlSelect3">Category</label>
                          <div className="select2-drpdwn-project select-options">
                              <select defaultValue="null" onChange={e => setType(e.target.value)} required>
                                <option value="">select a category</option>
                                <option value="flavored">flavored</option>
                                <option value="plane">plane</option>
                                <option value="spiced">spiced</option>
                              </select>
                          </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <div className="form-group mb-0">
                        <label htmlFor="exampleFormControlTextarea4">Description</label>
                        <input className="form-control" type="text" name="description"
                        autoComplete="off"
                                                            value={description}
                                                            onChange={e => setDescription(e.target.value)}
                                                            placeholder="description" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer">
  

                {loading ?  <button className="btn btn-primary mr-1">
                                  <i className="fa fa-spinner fa-spin"></i>Loading...
                            </button> : 
                            <button className="btn btn-primary mr-1" type="submit">
                               {Submit}
                            </button>
                }

                </div>
              </form>
            </div>
           
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default BaseInput;