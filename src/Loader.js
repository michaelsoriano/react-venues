import React from 'react';

function Loader(props){
    if(props.loading){
      return <div className="Loading"><span>{props.text}</span></div>
    }else{
      return <React.Fragment></React.Fragment>
    }
}

export default Loader;