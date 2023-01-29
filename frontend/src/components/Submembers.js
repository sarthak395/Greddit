import React from 'react'
import jwt from 'jwt-decode' // import dependency
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Submembers = () => {

    const [followers, setfollowers] = useState([]);
    const location = useLocation();

    useEffect(() => {   
        const pageid = location.search.slice(1);
        const fetchdata = async () => {

            let res = await fetch('http://localhost:3001/api/fetchsubmembers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body:
                    JSON.stringify({ pageid: pageid })// body data type must match "Content-Type" header
            })
            let resp = await res.json()
            if (resp.error) {
                console.log(resp.error)
            }
            else {
                let data = jwt(resp.token).followers;
                setfollowers(data)
            }
        }
        fetchdata()
    }, [])
    
    console.log(followers)
  return (
    <section class="text-gray-600 body-font">
  <div class="container px-5 py-24 mx-auto">
    <div class="flex flex-col text-center w-full mb-20">
      <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Our Members</h1>
    </div>
    <div class="flex flex-wrap -m-2">

      <div class="p-2 lg:w-1/3 md:w-1/2 w-full">
        <div class="h-full flex items-center border-gray-200 border p-4 rounded-lg">
          <img alt="team" class="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4" src="https://dummyimage.com/108x98" />
          <div class="flex-grow">
            <h2 class="text-gray-900 title-font font-medium">Rodrigo Monchi</h2>
            <p class="text-gray-500">Product Manager</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
  )
}

export default Submembers