import React, { Fragment, useState, useEffect, useStateCallback } from 'react';
import Breadcrumb from '../../common/breadcrumb';
import {BasicFormControl,BasicHTMLInputControl,EdgesInputStyle,FlatInputStyle,RaiseInputStyle,SolidInputStyle,InputSizing,CustomControls,
EmailAddress,Password,ExampleSelect,ExampleMultipleSelect,ExampleTextarea,Submit,SimpleInput,Placeholder,Date,Month, Time,ColorPicker,
LargeInput,SmallInput,MaximumLength,CustomSelect,Disabled,Textarea,StaticText,UploadFile,Telephone,DateAndTime,Week,Number,  
LargeSelect,DefaultSelect,SmallSelect,DefaultInput,URL} from '../../../constant'
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';

const AddCoupons = ({ history }) => {
  const [price, setPrice] = useState("")
  const [coupon, setCoupon] = useState("")
  const [endDate, setEndDate] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const abortController = new AbortController();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
        history.push(`${process.env.PUBLIC_URL}/login`);
    }
    return function cleanup() {
      abortController.abort();
  };
  }, [history]);

  const config = {
    headers: {
      'Authorization':`Bearer ${localStorage.getItem("token")}`
    }
   }


  // Handles file upload event and updates state
    const submitProduct = async (e) => {
      e.preventDefault()
      
      try {
          setLoading(true)
          const products = await axios.post(`http://localhost:7426/api/v1/coupon/post`, {price, description, endDate, coupon},config)
          setLoading(false)
          history.push(`${process.env.PUBLIC_URL}/coupons`);
      } catch (error) {
        console.log(error)
        setLoading(false)
        if(error.response.status == 401){
          localStorage.clear()
          setTimeout(() => {
              toast.error("Oppss... please login again");
          }, 200)
          history.push(`${process.env.PUBLIC_URL}/login`)
        }
        else{
          setTimeout(() => {
              toast.error("Oppss... please reenter the data!");
          }, 200);
        }
      }
      setDescription("")
      setCoupon("")
      setPrice("")
      setLoading(false)
      setEndDate("")

    }
     
  return (
    <Fragment>
      <Breadcrumb title="Basic Input" parent="Form" />
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header">
                <h5>Add New Coupon</h5>
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
                        <label htmlFor="exampleFormControlInput1">Coupon</label>
                        <input className="form-control" type="text" name="filename"
                        autoComplete="off"
                                                            value={coupon}
                                                            onChange={e => setCoupon(e.target.value)}
                                                            placeholder="coupon"
                                                        required/>                     
                                                         </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="exampleFormControlSelect9">End Date</label>
                        <input className="form-control" type="date" name="weight"
                        autoComplete="off"
                                                            value={endDate}
                                                            onChange={e => setEndDate(e.target.value)}
                                                            placeholder="price"
                                                        required/>
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

export default AddCoupons;