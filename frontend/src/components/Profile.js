import React from 'react'
import { useState, useEffect } from 'react'
import WithAuth from './WithAuth'
import jwt from 'jwt-decode' // import dependency
import { Email } from '@material-ui/icons'

const Profile = (user) => {

  const [userdata, setuserdata] = useState({})

  useEffect(() => {

    var token = localStorage.getItem("token")
    setuserdata(jwt(token))

  }, [])

  const capitalisefirst = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  console.log(userdata)

  return (
    <section class="text-gray-600 body-font">
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
                  <div class="px-4 py-2">{userdata.firstname}</div>
                </div>
                <div class="grid grid-cols-2">
                  <div class="px-4 py-2 font-semibold">Last Name</div>
                  <div class="px-4 py-2">{userdata.lastname}</div>
                </div>
                <div class="grid grid-cols-2">
                  <div class="px-4 py-2 font-semibold">User Name</div>
                  <div class="px-4 py-2">{userdata.username}</div>
                </div>
                <div class="grid grid-cols-2">
                  <div class="px-4 py-2 font-semibold">Contact No.</div>
                  <div class="px-4 py-2">+91 {userdata.contactno}</div>
                </div>


                <div class="grid grid-cols-2">
                  <div class="px-4 py-2 font-semibold">Email.</div>
                  <div class="px-4 py-2">
                    <a class="text-blue-800" href="mailto:jane@example.com">{userdata.email}</a>
                  </div>
                </div>
                <div class="grid grid-cols-2">
                  <div class="px-4 py-2 font-semibold">Age</div>
                  <div class="px-4 py-2">{userdata.age}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WithAuth(Profile)