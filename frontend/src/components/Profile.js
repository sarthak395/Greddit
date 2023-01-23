import React from 'react'
import { useState, useEffect } from 'react'
import WithAuth from './WithAuth'
import jwt from 'jwt-decode' // import dependency
import { Navigate, useLocation } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'

const Profile = (user) => {

  const [userdata, setuserdata] = useState({})
  const [editable, seteditable] = useState(false)
  const [newdata, setnewdata] = useState({})
  const [password, setpassword] = useState("")

  useEffect(() => {

    var token = localStorage.getItem("token")
    setuserdata(jwt(token))
    setnewdata(jwt(token))
  }, [])

  let navigate = useNavigate()
  const updateData = e => {
    setnewdata({
      ...newdata,
      [e.target.name]: e.target.value
    })
  }

  const updatepassword = (e) => {
    setpassword(e.target.value)
  }

  const capitalisefirst = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const editdetails = async () => {

    if (editable && !(userdata === newdata)) {
      let res = await fetch('http://localhost:3001/api/updatedetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body:
          JSON.stringify({ newdata: newdata, password: password })// body data type must match "Content-Type" header
      })
      let resp = await res.json()
      if (resp.error) {
        toast.error(resp.error)
      }
      else {
        localStorage.setItem("token", resp.token)
        toast.success("Data Updated Successfully")
      }
    }

    seteditable(!editable)
  }

  // console.log(userdata)

  return (
    <section class="text-gray-600 body-font">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div class="container px-5 py-24 mx-auto">
        <div class="flex flex-col text-center w-full mb-20">
          <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">{userdata.firstname} {userdata.lastname}!! </h1>
          <p class="lg:w-2/3 mx-auto leading-relaxed text-base">Yes , we have your data , hope its not too important . Welcome to Greddit , a reddit clone for all your dank memes and software updates . Any malicious content will be reported and you will be banished from reddit</p>
        </div>
        <div class="flex flex-col text-center w-full mb-20 ">
          <div class="bg-white p-3 shadow-sm rounded-sm">
            <div class="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
              <span clas="text-green-500">
                <svg class="h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <span class="tracking-wide">About</span>
            </div>
            <div class="text-gray-700">
              <div class="grid md:grid-cols-2 text-sm">
                <div class="grid grid-cols-2">
                  <div class="px-4 py-2 font-semibold">First Name</div>
                  {!editable && <div class="px-4 py-2">{userdata.firstname}</div>}
                  {editable && <input onChange={updateData} type='text' name='firstname' class="px-4 py-2" placeholder={userdata.firstname} />}
                </div>
                <div class="grid grid-cols-2">
                  <div class="px-4 py-2 font-semibold">Last Name</div>
                  {!editable && <div class="px-4 py-2">{userdata.lastname}</div>}
                  {editable && <input onChange={updateData} type='text' name="lastname" class="px-4 py-2" placeholder={userdata.lastname} />}
                </div>
                <div class="grid grid-cols-2">
                  <div class="px-4 py-2 font-semibold">User Name</div>
                  {!editable && <div class="px-4 py-2">{userdata.username}</div>}
                  {editable && <input onChange={updateData} type='text' name="username" class="px-4 py-2" placeholder={userdata.username} />}
                </div>
                <div class="grid grid-cols-2">
                  <div class="px-4 py-2 font-semibold">Contact No.</div>
                  {!editable && <div class="px-4 py-2">{userdata.contactno}</div>}
                  {editable && <input onChange={updateData} type='text' name="contactno" class="px-4 py-2" placeholder={userdata.contactno} />}
                </div>


                <div class="grid grid-cols-2">
                  <div class="px-4 py-2 font-semibold">Email.</div>
                  {!editable && <div class="px-4 py-2">{userdata.email}</div>}
                  {editable && <input onChange={updateData} type='text' name='email' class="px-4 py-2" placeholder={userdata.email} />}
                </div>
                <div class="grid grid-cols-2">
                  <div class="px-4 py-2 font-semibold">Age</div>
                  {!editable && <div class="px-4 py-2">{userdata.age}</div>}
                  {editable && <input onChange={updateData} type='text' name='age' class="px-4 py-2" placeholder={userdata.age} />}
                </div>
                {editable && <div class="grid grid-cols-2">
                  <div class="px-4 py-2 font-semibold">Password </div>
                  <input onChange={updatepassword} type='password' name='password' class="px-4 py-2" placeholder="Enter Password" required />
                </div>}
              </div>
            </div>
          </div>
          {!editable && <button onClick={editdetails} class="flex text-white bg-indigo-500 text-center border-0 py-2 px-6 w-[8%]  focus:outline-none hover:bg-indigo-600 rounded">Edit</button>}
          {editable && <button onClick={editdetails} class="flex text-white bg-indigo-500 text-center border-0 py-2 px-6 w-[15%]  focus:outline-none hover:bg-indigo-600 rounded">Confirm Changes</button>}
        </div>

        <div class="flex flex-wrap -m-4 text-center">

          <button onClick={()=>{navigate('/followers')}}  class="p-4 md:w-1/4 sm:w-1/2 m-auto w-full ">
            <div class="border-2 border-gray-200 px-4 py-6 rounded-lg hover:bg-gray-300">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="text-indigo-500 w-12 h-12 mb-3 inline-block" viewBox="0 0 24 24">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75"></path>
              </svg>
              <h2 class="title-font font-medium text-3xl text-gray-900">{userdata.numfollowers}</h2>
              <p class="leading-relaxed">Followers</p>
            </div>
          </button>
          <button onClick={()=>{navigate('/following')}} class="p-4 md:w-1/4 sm:w-1/2 w-full m-auto">
            <div class="border-2 border-gray-200 px-4 py-6 rounded-lg hover:bg-gray-300">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="text-indigo-500 w-12 h-12 mb-3 inline-block" viewBox="0 0 24 24">
                <path d="M3 18v-6a9 9 0 0118 0v6"></path>
                <path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"></path>
              </svg>
              <h2 class="title-font font-medium text-3xl text-gray-900">{userdata.numfollowing}</h2>
              <p class="leading-relaxed">Following</p>
            </div>
          </button>

        </div>
      </div>
    </section>
  )
}

export default WithAuth(Profile)