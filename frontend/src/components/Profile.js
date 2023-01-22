import React from 'react'
import { useState, useEffect } from 'react'
import WithAuth from './WithAuth'
import jwt from 'jwt-decode' // import dependency
import { Navigate, useLocation } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
          <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Welcome sexy {userdata.firstname} !! </h1>
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
                  <input onChange={updatepassword} type='text' name='password' class="px-4 py-2" placeholder="Enter Password" required />
                </div>}
              </div>
            </div>
          </div>
          {!editable && <button onClick={editdetails} class="flex text-white bg-indigo-500 text-center border-0 py-2 px-6 w-[8%]  focus:outline-none hover:bg-indigo-600 rounded">Edit</button>}
          {editable && <button onClick={editdetails} class="flex text-white bg-indigo-500 text-center border-0 py-2 px-6 w-[15%]  focus:outline-none hover:bg-indigo-600 rounded">Confirm Changes</button>}
        </div>
      </div>
    </section>
  )
}

export default WithAuth(Profile)