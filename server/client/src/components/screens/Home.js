import React, { Fragment, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';
import axios from 'axios';
import Loading from './Loading'

function Home() {
    const history = useHistory()
    const [posts, setPosts] = useState(null)
    const [likes, setLikes] = useState(null)
    const loggedInUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))._id : null
    const [text, setText] = useState("")

    useEffect(() => {
        fetchPosts();
    }, [])

    const formateDate = (date) => {
        return new Date(date)
    }


    const fetchPosts = async () => {
        const OPTIONS = {
            url: "/all-post-following/" + loggedInUser,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "token": "Bearer " + localStorage.getItem("token")
            }
        }
        try {
            let res = await axios(OPTIONS)
            if (res.data.error) {
                M.toast({ html: res.data.error, classes: "#d32f2f red darken-2" })
            } else {
                setPosts(res.data.posts)
                console.log(res.data.posts)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const like = async (postId) => {
        const OPTIONS = {
            url: "/like",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "token": "Bearer " + localStorage.getItem("token")
            },
            data: {
                postId
            }
        }
        try {
            let res = await axios(OPTIONS)
        } catch (err) {
            console.log(err)
        }
        fetchPosts()
    }

    const unlike = async (postId) => {
        const OPTIONS = {
            url: "/unlike",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "token": "Bearer " + localStorage.getItem("token")
            },
            data: {
                postId
            }
        }
        try {
            let res = await axios(OPTIONS)
        } catch (err) {
            console.log(err)
        }
        fetchPosts()
    }

    const makeComment = async (text, postId) => {
        const OPTIONS = {
            url: "/comment",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "token": "Bearer " + localStorage.getItem("token")
            },
            data: {
                text,
                postId
            }
        }
        try {
            let res = await axios(OPTIONS)
            console.log(res.data.result)
        } catch (err) {
            console.log(err)
        }
        fetchPosts()
        setText("")

    }

    const deletePost = async (postId, filename) => {
        const OPTIONS = {
            url: "/delete",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "token": "Bearer " + localStorage.getItem("token")
            },
            data: {
                postId,
                loggedInUser,
                filename
            }
        }
        try {
            let res = await axios(OPTIONS)
            M.toast({ html: res.data.result, classes: "#43a047 green darken-1" })
        } catch (err) {
            console.log(err)
        }
        fetchPosts()
    }

    if (posts != null && posts.length === 0) {
        history.push('/global')
        return <div></div>
    }

    return (
        <div className="home-card">
                {posts && posts.length ? posts.map(items=>{
                    return (
                        <Fragment key={items._id}>
                        <div className="card">
                            <div style={{padding:"5px"}}>
                            <Link to={"/profile/"+items.postedBy._id}>
                                <div style={{ position:"relative" }}>
                                    <img style={{ height:"50px", width:"50px", borderRadius:"50px" }} src={"http://localhost:5000/uploads/profile_pic/"+items.postedBy.profile_pic} alt={items.postedBy._id}/>
                                    <span style={{ position:"absolute", top:"12px", marginLeft:"10px", fontWeight:"bold" }} >{items.postedBy.name}</span>
                                </div>
                            </Link>  
                            {
                                loggedInUser === items.postedBy._id
                                ?  <i onClick={()=> deletePost(items._id,items.image)} className="material-icons" style={{float:"right"}}>delete</i>
                                : <i></i>
                            }
                            </div>
                            <div className="card-image">
                            <img src={"http://localhost:5000/uploads/"+items.image} />
                            </div>
                            <div className="card-content">
                            {
                                items.likes.includes(loggedInUser) 
                                ? <i onClick={()=> unlike(items._id)} className="material-icons" style={{color:"red"}}>favorite</i> 
                                : <i onClick={()=> like(items._id)} className="material-icons" style={{color:"black"}}>favorite</i> 
                            }                           
                            

                            <span style={{ fontWeight:"bold", marginLeft:"20px" }}>{items.likes.length} likes</span>
                            <span style={{ fontWeight:"bold", marginLeft:"20px" }}>{items.comments.length} comments</span>
                            <h6>{items.title}</h6>
                              <p>{items.body}</p>
                              <p>Published on {
                                formateDate(items.date).getDate()+"-"+formateDate(items.date).getMonth()+"-"+formateDate(items.date).getFullYear()
                              }</p>
                            
                            {
                                items.comments 
                                ?  items.comments.map((record)=>{
                                    return (
                                        <h6><span style={{fontWeight:"500"}}><strong>{record.postedBy.name}</strong></span> {record.text}</h6>
                                    )
                                })
                                : <br/>
                            }
                            
                            <form onSubmit={(e)=>{
                                e.preventDefault();
                                makeComment(text,items._id)
                            }}>
                            <input value={text} onChange={(e)=> setText(e.target.value)} type="text" placeholder="add a comment" />  
                            </form>
                            
                            </div>
                        </div>
                        </Fragment>
                    )
                }) 
                : <Loading/>
            }
             
       </div>
    );
}

export default Home;