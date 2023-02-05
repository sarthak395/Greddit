import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom';
import jwt from 'jwt-decode' // import dependency
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Navbar from './Navbar';

const Subgredit = () => {

    let navigate = useNavigate();
    let location = useLocation();

    const [pageid, setpageid] = useState(location.search.slice(1))
    const [posts, setposts] = useState([]);
    const [createpostaccess, setcreatepostaccess] = useState(false)

    useEffect(() => {
        const fetchdata = async () => {
            let res = await fetch('http://localhost:3001/api/fetchposts', {
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
                let data = jwt(resp.token).posts;

                let usertoken = localStorage.getItem('token');
                let userdata = jwt(usertoken)
                
                
                if (userdata.username === resp.moderator) {
                    setcreatepostaccess(true)
                }

                setposts(data)
            }
        }
        fetchdata();

    }, [])


    return (
        <>

            <section className="text-gray-600 body-font">
                <div className="container px-5 py-24 mx-auto">
                    <div className="flex flex-wrap w-full mb-20 flex-col items-center text-center">
                        <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">Here are all the Posts</h1>
                    </div>
                    <div className="flex flex-wrap -m-4">

                        {posts.map((post) => {
                            return (
                                <div className="xl:w-1/3 md:w-1/2 p-4">
                                    <div className="border border-gray-200 p-6 rounded-lg">
                                        <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4">
                                            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-6 h-6" viewBox="0 0 24 24">
                                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                            </svg>
                                        </div>
                                        <h2 className="text-lg text-gray-900 font-medium title-font mb-2">{post.Title}</h2>
                                        <p className="leading-relaxed text-base">{post.Text}</p>
                                    </div>
                                </div>
                            )
                        })}



                    </div>
                    {createpostaccess && <button onClick={() => { navigate(`/subgreddit/createpost?${pageid}`) }} className="flex mx-auto mt-16 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">Create More</button>}
                </div>
            </section>
        </>
    )
}

export default Subgredit