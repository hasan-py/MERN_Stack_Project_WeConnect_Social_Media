import React, { Fragment, useContext, useRef, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios'
import { UserContext } from '../App';
import M from 'materialize-css';

function Navber() {
    const [sinput, setSinput] = useState(null)
    const { state, dispatch } = useContext(UserContext)
    const history = useHistory()
    const loggedInUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))._id : null
    const [users, setUsers] = useState(null)

    const searchModal = useRef(null)
    const sideNav = useRef(null)

    useEffect(() => {
        M.Modal.init(searchModal.current);
        M.Sidenav.init(sideNav.current);
    }, [])

    useEffect(() => {
        fetchUser();
    }, [sinput])

    const fetchUser = async () => {
        const OPTIONS = {
            url: "/search-user",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "token": "Bearer " + localStorage.getItem("token")
            },
            data: {
                query: sinput
            }
        }
        try {
            let res = await axios(OPTIONS)
            if (res.data.result) {
                console.log(res.data.result)
                setUsers(res.data.result)
            }
        } catch (err) {
            console.log(err)
        }
    }

    // Protected route
    const renderList = () => {
        if (state.userDetails || localStorage.getItem("token")) {
            return [
                <li><Link><i data-target="modal1" style={{ color:"black", marginRight:"10px"}} class="material-icons modal-trigger">search</i></Link></li>,
                <li><Link to="/"><i style={{ color:"black"}} class="material-icons">home</i></Link></li>,
                <li><Link to="/global"><i style={{ color:"black"}} class="material-icons">people</i></Link></li>,
                <li><Link to="/profile"><i style={{ color:"black"}} class="material-icons">account_circle</i></Link></li>,
                <li><Link to="/create-post"><i style={{ color:"black"}} class="material-icons">add_a_photo</i></Link></li>,
                <li><Link>
                    <i onClick={()=>{
                    localStorage.clear()
                    dispatch({type:"CLEAR"})
                    history.push('/login')
                    M.toast({html:"Logout successfully",classes:"#43a047 green darken-1"})
                }}  style={{ color:"black"}} class="material-icons">login</i>
                </Link></li>
            ]
        } else {
            return [
                <li><Link to="/login">Login</Link></li>,
                <li><Link to="/signup">Signup</Link></li>
            ]
        }
    }


    return (
        <Fragment>
        <div class="navbar-fixed">
       <nav> 
	    <div className="nav-wrapper white">
		    <div className="container">
		      <Link to={state.userDetails ? "/" : "/login"} className="brand-logo logo">WeConnect</Link>
              <a href="#" data-target="mobile-demo" class="sidenav-trigger"><i class="material-icons">menu</i></a>
		      <ul className="right hide-on-med-and-down">
		       {renderList()}
		      </ul>
		    </div>


	    </div>
	  </nav>
        </div>
            <ul ref={sideNav} class="sidenav" id="mobile-demo">
                {renderList()}
            </ul>
	  <div ref={searchModal} id="modal1" className="modal">
	    <div className="modal-content">
            <h5>Search Email</h5>
	       <div style={{ marginBottom:"20px", cursor:"auto" }} className="row">
		      <div className="input-field">
		        <i className="material-icons">srarch</i>
		        <input onChange={e=> setSinput(e.target.value)} id="icon_prefix" type="text" className="validate" />
		      </div>
		  </div>
		  {
		  	users && users.length>0
		  	? <ul class="collection">
		  		{
		  			users.map(item=>{
		  			return (
						<li class="collection-item">
							<Link to={"/profile/"+item._id}>
                                <div className="modal-close" style={{ position:"relative" }}>
                                    <img style={{ height:"50px", width:"50px", borderRadius:"50px" }} src={"http://localhost:5000/uploads/profile_pic/"+item.profile_pic} alt={item._id}/>
                                    <span style={{ position:"absolute", top:"12px", marginLeft:"10px", fontWeight:"bold" }} >{item.name}</span>
                                    <span className="new badge black" data-badge-caption="Followers">{item.followers.length}</span>
                                    <span style={{ marginLeft:"10px"}}>{item.email}</span>
                                </div>
                            </Link>
		      			</li>
		  				)
		  			})
		  		}
		  		</ul> 
		  	: <ul>No result found</ul>
		  }
		   
	    </div>
	    <div className="modal-footer">
	      <a href="#!" className="btn btn-small black white-text modal-close waves-effect">Cancel</a>
	    </div>
	  </div>
    </Fragment>
    );
}

export default Navber;