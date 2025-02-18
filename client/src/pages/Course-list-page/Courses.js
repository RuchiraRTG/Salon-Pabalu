import React from "react";
import './Courses.css'
import { Link } from 'react-router-dom'


function Courses(props){
    return(
    <>
        <div className="page">

            <div className="main-Container" >

                <div className="img-Container">

                    <div className="imgitem">
                       <img src={props.Img} alt="image 1" className="image"/>
                    </div>
                    <div className="">
                        <p>{props.name}</p>
                    </div>
                    
                </div> 

                <div className="course-prices">
                        <div className="course-price-new">
                        <p>Rs:{props.newprice}</p>
                        </div>
                        <div className="course-price-old">
                        <p>Rs:{props.oldprice}</p>
                        </div>                                                  
                    </div>

                    {/* <div>
                        <p>Duration:- {props.duration}</p>
                       
                    </div>   */}

                <div className="description-Container">
             
                    <p className="description">{props.description}</p>
                </div>

                <div className="buttonContainer1">
                    <Link to={`/enroll/${props.id}`} ><button className="btn2">Enroll Here</button></Link>                   
                    <Link to={`/seedetails/${props.id}`} ><button className="btn2">See more...</button></Link>
                    
                </div>


            </div>


        </div>


    </>

    )
}

export default Courses