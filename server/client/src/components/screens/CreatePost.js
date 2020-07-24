import React, { Fragment, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import M from 'materialize-css';

import { UserContext } from '../../App';


const CreatePost = () => {
    const { state, dispatch } = useContext(UserContext)
    const history = useHistory()
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")

    const postData = async () => {
        if (image === "" || title === "" || body === "") {
            return M.toast({ html: "Please insert all filled", classes: "#d32f2f red darken-2" })
        }
        const formData = new FormData()
        formData.append('image', image)
        formData.append('title', title)
        formData.append('body', body)
        formData.append('postedBy', state.userDetails._id)

        const OPTIONS = {
            url: "/create-post",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "token": "Bearer " + localStorage.getItem("token")
            },
            data: formData
        }
        try {
            let res = await axios(OPTIONS)
            if (res.data.error) {
                M.toast({ html: res.data.error, classes: "#d32f2f red darken-2" })
            } else {
                console.log(res.data)
                M.toast({ html: res.data.message, classes: "#43a047 green darken-1" })
                history.push("/")
            }
        } catch (err) {
            console.log(err)
        }
    }
    return (
      <Fragment>
       <div className="card input-filed"
       style={{
           margin:"30px auto",
           maxWidth:"500px",
           padding:"20px",
           textAlign:"center"
       }}
       >
           <input 
            type="text"
            placeholder="title"
            value={title}
            onChange={e=> setTitle(e.target.value)}
            />
           <input
            type="text"
            placeholder="body"
            value={body}
            onChange={e=> setBody(e.target.value)}
            />
           <div className="file-field input-field">
            <div className="waves-effect black white-text waves-light btn">
                <span>Uplaod Image</span>
                <input onChange={e=> setImage(e.target.files[0])} type="file" />
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
            </div>
            </div>
            <button onClick={()=> postData()} class="waves-effect black white-text waves-light btn">Post Now</button>
       </div>
    </Fragment>
    )
}

export default CreatePost