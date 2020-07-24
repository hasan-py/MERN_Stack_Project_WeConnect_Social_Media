import React, { Fragment, useState, useContext } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';
import { UserContext } from '../../App';


function Login() {
    // Always dispatch an object not function
    const { state, dispatch } = useContext(UserContext)
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const history = useHistory()
    const loggedInUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))._id : null

    const postData = async () => {
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return M.toast({ html: "Invalid Email", classes: "#d32f2f red darken-2" })
        }
        const OPTIONS = {
            url: "/signin",
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            data: {
                email,
                password
            }
        }
        try {
            let res = await axios(OPTIONS)
            if (res.data.error) {
                M.toast({ html: res.data.error, classes: "#d32f2f red darken-2" })
            } else {
                // For store data in localstorage.
                let userDetail = JSON.stringify(res.data.user)
                M.toast({ html: res.data.message, classes: "#43a047 green darken-1" })
                localStorage.setItem("token", res.data.token)
                localStorage.setItem("user", userDetail)
                // Parse to object and pass it to rudecer.
                dispatch({ type: "USER", payload: JSON.parse(userDetail) })
                history.push("/")
            }
        } catch (err) {
            console.log(err)
        }
    }

    if (loggedInUser) {
        history.push("/")
        return <Fragment></Fragment>
    }
    return (
      <Fragment>
        <div className="login-card input-field">
           <div className="card login">
          <h3  className="logo">Login | WeConnect </h3>
          <input value={email} onChange={e=> setEmail(e.target.value)} className="form" type="text" placeholder="Enter email" />
          <input value={password} onChange={e=> setPassword(e.target.value)} className="form" type="password" placeholder="Enter password" />
          <button onClick={()=> postData()} class="waves-effect black white-text waves-light btn">Login</button>
          <br/>
          <Link to="/signup">Have't account ? Signup here</Link>
           </div>
        </div>
      </Fragment>
    );
}

export default Login;