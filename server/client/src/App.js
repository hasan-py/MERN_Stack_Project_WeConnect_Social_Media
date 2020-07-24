import React, { Fragment, useReducer, createContext, useContext, useState, useEffect } from 'react';
import './App.css';
import Navber from './components/Navber'
import { Home, Profile, Login, Signup, CreatePost, OwnProfile, GlobalPost } from './components/screens'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useHistory
} from "react-router-dom";
import { Reducer, initialState } from './components/context/Reducer'

export const UserContext = createContext()


const Routing = () => {

    const history = useHistory()
    const { state, dispatch } = useContext(UserContext)

    // When app render
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"))
        const token = localStorage.getItem("token")

        if (user && token) {
            dispatch({ type: "USER", payload: user })
        } else {
            history.push('/login')
        }
    }, [])

    return (
        <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/global">
          <GlobalPost />
        </Route>
        <Route path="/profile/:user_id">
          <Profile />
        </Route>
        <Route exact path="/profile">
          <OwnProfile />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/signup">
          <Signup />
        </Route>
        <Route path="/create-post">
          <CreatePost />
        </Route>
    </Switch>
    )
}


function App() {
    const [state, dispatch] = useReducer(Reducer, initialState)

    return (
        <UserContext.Provider value={{state,dispatch}}>
      <div className="App">
        <Router>
        <Navber/>
           <Routing/>
        </Router>
      </div>
    </UserContext.Provider>
    );
}

export default App;