import React, { Fragment, useState } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';

function Signup() {
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const history = useHistory()
    const loggedInUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))._id : null

    const postData = async () => {
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return M.toast({ html: "Invalid Email", classes: "#d32f2f red darken-2" })
        }
        if (password.length < 8) {
            return M.toast({ html: "Password must be 8 char long.", classes: "#d32f2f red darken-2" })
        }
        const OPTIONS = {
            url: "/signup",
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            data: {
                name,
                email,
                password
            }
        }
        try {
            let res = await axios(OPTIONS)
            console.log(res.data)
            if (res.data.error) {
                M.toast({ html: res.data.error, classes: "#d32f2f red darken-2" })
            } else {
                M.toast({ html: res.data.message, classes: "#43a047 green darken-1" })
                history.push("/login")
            }
        } catch (err) {
            console.log(err)
        }
    }

    if (loggedInUser) {
        history.push('/')
        return <Fragment></Fragment>
    }
    return (
        <Fragment>
	       <div className="login-card input-field">
		       <div className="card login">
					<h3 className="logo">Signup | WeConnect </h3>
					<input value={name} onChange={e=> setName(e.target.value)} className="form" type="text" placeholder="Enter Name" />
					<input value={email} onChange={e=> setEmail(e.target.value)} className="form" type="email" placeholder="Enter email" />
					<input value={password} onChange={e=> setPassword(e.target.value)} className="form" type="password" placeholder="Enter password" />
					<button onClick={()=> postData()} class="waves-effect black white-text waves-light btn">SIGNUP</button>
					<br/>
					<Link to="/login">Already have account ? Login here</Link>
		       </div>
	    	</div>
	    </Fragment>
    );
}

export default Signup;