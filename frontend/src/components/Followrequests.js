import React from 'react'
import jwt from 'jwt-decode' // import dependency
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Followrequests = () => {

  const [requests, setrequests] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const pageid = location.search.slice(1);
    const fetchdata = async () => {

      let res = await fetch('http://localhost:3001/api/fetchjoiningreq', {
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
        let data = jwt(resp.token).requests;
        setrequests(data)
      }
    }
    fetchdata()
  }, [])

  const acceptrequest=async(pusername)=>{
    const pageid = location.search.slice(1);
    let res = await fetch('http://localhost:3001/api/acceptjoiningreq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body:
          JSON.stringify({ pageid: pageid , username:pusername })// body data type must match "Content-Type" header
      })
      let resp = await res.json()
      if (resp.error) {
        console.log(resp.error)
      }
      else {
        let data = jwt(resp.token).requests;
        setrequests(data)
      }
  }

  const rejectrequest=async(pusername)=>{
    const pageid = location.search.slice(1);
    let res = await fetch('http://localhost:3001/api/rejectjoiningreq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body:
          JSON.stringify({ pageid: pageid , username:pusername })// body data type must match "Content-Type" header
      })
      let resp = await res.json()
      if (resp.error) {
        console.log(resp.error)
      }
      else {
        let data = jwt(resp.token).requests;
        setrequests(data)
      }
  }

  console.log(requests)
  
  return (
    <section class="text-gray-600 body-font">
      <div class="container px-5 py-24 mx-auto">
        <div class="flex flex-col text-center w-full mb-20">
          <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Join Requests</h1>
        </div>
        
        <div class="flex flex-wrap -m-2">

          {requests.map((request) => {
              return (
                <div class="p-2 lg:w-1/3 md:w-1/2 w-full">
                  <div class="h-full flex items-center border-gray-200 border p-4 rounded-lg">
                    <Link to={`/otherprofile?username=${request.pusername}`} class="flex-grow">
                      <h2 class="text-gray-900 title-font font-medium">{request.pfirstname} {request.plastname}</h2>
                      <p class="text-gray-500">{request.pusername}</p>
                    </Link>
                    <button onClick={()=>acceptrequest(request.pusername)} className='text-green-500 hover:bg-gray-200  m-2 font-bold py-2 px-4 border border-b-slate-200 rounded-full'>Accept</button>
                    <button onClick={()=>rejectrequest(request.pusername)} className='text-red-500 hover:bg-gray-200  font-bold py-2 px-4 border border-b-slate-200 rounded-full'>Reject</button>
                  </div>
                </div>
              )
          })}
        </div>
      </div>
    </section>
  )
}

export default Followrequests