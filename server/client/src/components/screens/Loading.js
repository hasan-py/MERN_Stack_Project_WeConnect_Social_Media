import React, { Fragment } from 'react';
import M from 'materialize-css';

function Loading() {
    return (
        <Fragment>
        <div style={{ justifyContent:"cener",alignItems:"center",textAlign:"center",marginTop:"200px" }}>	
		  <div className="preloader-wrapper big active">
		    <div className="spinner-layer spinner-blue-only">
		      <div className="circle-clipper left">
		        <div className="circle"></div>
		      </div><div className="gap-patch">
		        <div className="circle"></div>
		      </div><div className="circle-clipper right">
		        <div className="circle"></div>
		      </div>
		    </div>
		  </div>
        </div>
		</Fragment>
    );
}

export default Loading;