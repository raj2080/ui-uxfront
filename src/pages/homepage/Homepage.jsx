//import React from "react";

import React, {useEffect} from "react";
import Navbar from "../../components/Navbar";

import {testApi} from "../../apis/Api";


const Homepage = () => {

  //print hello! when page load (Automatic)
  useEffect(() => {
    console.log("hello world !!")


    // //triger testApi
    // testApi().then((res) => {
    //   console.log(res)  // "test api is working"
    // })
     


  })










  return (
    <div>

       <p> this is homepage </p> 


    </div>
  )


}

export default Homepage;