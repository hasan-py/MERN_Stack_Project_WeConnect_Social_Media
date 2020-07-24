import React, { Fragment, useEffect, useState, useContext } from 'react';
import { UserContext } from '../../App'
import M from 'materialize-css';
import axios from 'axios';
import Loading from './Loading';
import SmallLoading from './SmallLoading';
import { useParams, Link } from 'react-router-dom';

function Profile() {
    const { state, dispatch } = useContext(UserContext)
    const [detail, setDetail] = useState(null)
    const [posts, setPosts] = useState(null)
    const loggedInUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))._id : null
    const { user_id } = useParams()
    const [logdata, setLogData] = useState(null)
    const [view, setView] = useState(false)
    const [text,setText] = useState("")

    const followBtn = loggedInUser === user_id ? <span></span> : <span onClick={()=> followUser()} style={{ marginBottom:"10px", marginRight:"10px" }} className="btn blue text-white">Follow</span>
    const followingBtn = loggedInUser === user_id ? <span></span> : <span onClick={()=> unfollowUser()} style={{ marginBottom:"10px", marginRight:"10px" }} className="btn blue text-white">Following</span>

    const [followersView,setFollowersView] = useState(false)
    const [followingView,setFollowingView] = useState(false)

    const [frList,setFrList] = useState(null)
    const [fwList,setFwList] = useState(null)

    const [lf,setLf] = useState(null)

    useEffect(() => {
        fetechUser();
        fetechUserLoggedIn();
        fetchFollowData();
        fetchFollowDataLoggedIn();
    }, [])

    useEffect(()=>{
      fetchFollowData();
    },[frList,fwList])

    const formateDate = (date) => {
        return new Date(date)
    }

    const fetchFollowData = async ()=> {
      const OPTIONS = {
            url: "/follow/" + user_id,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "token": "Bearer " + localStorage.getItem("token")
            }
        }
        try {
            let res = await axios(OPTIONS)
            if (res) {
                setFrList(res.data.followers)
                setFwList(res.data.following)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const fetchFollowDataLoggedIn = async ()=> {
      const OPTIONS = {
            url: "/follow/" + loggedInUser,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "token": "Bearer " + localStorage.getItem("token")
            }
        }
        try {
            let res = await axios(OPTIONS)
            if (res) {
                setLf(res.data.followers)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const fetechUser = async () => {
        const OPTIONS = {
            url: "/profile/" + user_id,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "token": "Bearer " + localStorage.getItem("token")
            }
        }
        try {
            let res = await axios(OPTIONS)
            if (res) {
                setPosts(res.data.posts)
                setDetail(res.data.detail)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const fetechUserLoggedIn = async () => {
        const OPTIONS = {
            url: "/profile/" + loggedInUser,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "token": "Bearer " + localStorage.getItem("token")
            }
        }
        try {
            let res = await axios(OPTIONS)
            if (res) {
                setLogData(res.data.detail)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const followUser = async () => {
        const OPTIONS = {
            url: "/follow",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "token": "Bearer " + localStorage.getItem("token")
            },
            data: {
                followId: user_id
            }
        }
        try {
            let res = await axios(OPTIONS)
            if (res) {
                console.log(res.data.message)
            }
        } catch (err) {
            console.log(err)
        }
        fetechUser()
    }

    const unfollowUser = async () => {
        const OPTIONS = {
            url: "/unfollow",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "token": "Bearer " + localStorage.getItem("token")
            },
            data: {
                followId: user_id
            }
        }
        try {
            let res = await axios(OPTIONS)
            if (res) {
                console.log(res.data.message)
            }
        } catch (err) {
            console.log(err)
        }
        fetechUser()
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
        fetechUser()
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
        fetechUser()
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
        fetechUser()
        setText("")

    }

    return (
        <Fragment>
       <div style={{maxWidth:"550px",margin:"0px auto"}}>
           <div style={{
              margin:"18px 0px",
              borderBottom:"1px solid grey"
           }}>
           <div style={{
              display:"flex",
              justifyContent:"space-around",
              
           }}>
             <div>
              {
                detail 
                ? <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                 src={detail ? "http://localhost:5000/uploads/profile_pic/"+detail.profile_pic : ""}
                 />
                : <SmallLoading/>
              }
                 
             </div>
             <div>
                 <h4>{detail && detail.name ? detail.name : <Loading/>}</h4>
                 <h5>{detail && detail.email ? detail.email : <Loading/>}</h5>
                 <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                    <h6>{ lf && lf.includes(user_id) ? <span class="new badge grey" data-badge-caption="Follows you"></span> : ""}</h6>
                    <h6><span class="new badge blue" data-badge-caption="Post">{ posts ? posts.length : 0}</span></h6>
                    <h6><span style={{ cursor:"pointer" }} onClick={()=> followersView ? setFollowersView(false) : setFollowersView(true)} class="new badge black" data-badge-caption="Followers">{ detail ? detail.followers.length : 0 }</span></h6>
                    <h6><span style={{ cursor:"pointer" }} onClick={()=> followingView ? setFollowingView(false) : setFollowingView(true)} class="new badge orange" data-badge-caption="Following">{ detail ? detail.following.length : 0 }</span></h6>
                 </div>
                    <div style={{ marginTop:"10px",marginBottom:"10px" }}>
                      { frList && !frList.includes(loggedInUser) ? followBtn : followingBtn }
                      <span onClick={()=> setView(false)} style={{ marginBottom:"10px", marginRight:"10px" }} className="btn red text-white">Posts</span>
                      <span onClick={()=> setView(true)} style={{ marginBottom:"10px", marginRight:"10px" }} className="btn green text-white">Gallery</span>
                    </div>    
             </div>
           </div>
            </div> 
            
            {
              followersView
              ? <ul class="collection">
              <h5 style={{ textAlign:"center" }}>Followers <hr/></h5>
                  {
                   detail.followers.length>0 
                   ? detail.followers.map(item=>{
                    return (
                    <li class="collection-item">
                      <a href={"/profile/"+item._id}>
                            <div style={{ position:"relative" }}>
                                <img style={{ height:"50px", width:"50px", borderRadius:"50px" }} src={"http://localhost:5000/uploads/profile_pic/"+item.profile_pic} alt={item._id}/>
                                <span style={{ position:"absolute", top:"12px", marginLeft:"10px", fontWeight:"bold" }} >{item.name}</span>
                                
                                <span style={{ marginLeft:"10px"}}>{item.email}</span>
                            </div>
                        </a>
                        </li>
                      )
                    })
                   : <li style={{ margin:"10px", padding:"10px" }} >No followers</li>

                  }
                  </ul>
              : <ul></ul>
            }

            {
              followingView
              ? <ul class="collection">
              <h5 style={{ textAlign:"center" }}>Following <hr/></h5>
                  {
                   detail.following.length>0
                   ? detail.following.map(item=>{
                    return (
                    <li class="collection-item">
                      <a href={"/profile/"+item._id}>
                            <div style={{ position:"relative" }}>
                                <img style={{ height:"50px", width:"50px", borderRadius:"50px" }} src={"http://localhost:5000/uploads/profile_pic/"+item.profile_pic} alt={item._id}/>
                                <span style={{ position:"absolute", top:"12px", marginLeft:"10px", fontWeight:"bold" }} >{item.name}</span>
                                
                                <span style={{ marginLeft:"10px"}}>{item.email}</span>
                            </div>
                        </a>
                        </li>
                      )
                    })
                   : <li style={{ margin:"10px", padding:"10px" }} >No following</li>
                  }
                  </ul>
              : <ul></ul>
            }

           {
                  view 
                  ? <div className="gallery">
                      {posts && posts.length>0 ? posts.map(item=>{
                          return(
                            <img key={item._id} className="item"
                             src={"http://localhost:5000/uploads/"+item.image}
                             />
                          )
                      }): <h3 style={{ fontFamily:"Grand Hotel, cursive" }}>No Post published yet</h3> }
                   </div>
                  : <Fragment>
                      {
                        posts && posts.length>0 ? posts.map(item=>{
                          return(
                              <div className="card">
                                  <div style={{padding:"5px", position:"relative"}}>
                                    <Link to={"/profile/"+item.postedBy._id}>
                                        <div style={{ position:"relative" }}>
                                            <img style={{ height:"50px", width:"50px", borderRadius:"50px" }} src={"http://localhost:5000/uploads/profile_pic/"+item.postedBy.profile_pic} alt={item.postedBy._id}/>
                                            <span style={{ position:"absolute", top:"12px", marginLeft:"10px", fontWeight:"bold" }} >{item.postedBy.name}</span>
                                        </div>
                                    </Link>
                                  </div>
                                  <div style={{ position:"relative" }} className="card-image">
                                    <img src={"http://localhost:5000/uploads/"+item.image} />
                                  </div>
                                  <div className="card-content">
                                    {
                                        item.likes.includes(loggedInUser) 
                                        ? <i onClick={()=> unlike(item._id)} className="material-icons" style={{color:"red"}}>favorite</i> 
                                        : <i onClick={()=> like(item._id)} className="material-icons" style={{color:"black"}}>favorite</i> 
                                    }  
                                  <span style={{ fontWeight:"bold", marginLeft:"20px" }}>{item.likes.length} likes</span>
                                  <span style={{ fontWeight:"bold", marginLeft:"10px"}}>{item.comments.length} comments</span>
                                  <h6>{item.title}</h6>
                                  <p>{item.body}</p>
                                  <p>Published on {
                                    formateDate(item.date).getDate()+"-"+formateDate(item.date).getMonth()+"-"+formateDate(item.date).getFullYear()
                                  }</p>

                                    {
                                      item.comments 
                                      ?  item.comments.map((record)=>{
                                          return (
                                              <h6><span style={{ fontWeight:"500" }}><strong>{record.postedBy.name}</strong></span> {record.text}</h6>
                                          )
                                      })
                                      : <br/>
                                    }
                                    
                                    <form onSubmit={(e)=>{
                                        e.preventDefault();
                                        makeComment(text,item._id)
                                    }}>
                                    <input value={text} onChange={(e)=> setText(e.target.value)} type="text" placeholder="add a comment" />  
                                    </form>

                                  </div>
                            </div>
                          ) 
                        }) : <h3 style={{ fontFamily:"Grand Hotel, cursive" }}>No Post published yet</h3>
                      }
                    </Fragment>
              }
       </div>
    </Fragment>
    );
}

export default Profile;