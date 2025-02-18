import React, { useState , useEffect } from 'react'
import Courses from '../Course-list-page/Courses'
import '../../pages/Course-list-page/CoursePage.css'


export const CoursePage = () => {

  const [allcourses , setAllcourses] = useState([]);

    const fetchInfo = async() =>{
        await fetch('http://localhost:5000/courses/allcourses')
        .then((res) =>res.json())
        .then((data) =>{setAllcourses(data)});

    }

    useEffect(() =>{
      fetchInfo();
    },[])

    return (


      <div className='course-container'>

        <div className='searchbar'>

          

        </div>

            {allcourses.map((course,index) =>{
                return <>
                <Courses Img={course.image} newprice={course.newprice}  oldprice={course.oldprice} description={course.shortdescription} id={course._id} duration={course.duration}/>
                </>
            })}
  

      </div>
    )
  }
  
  export default CoursePage