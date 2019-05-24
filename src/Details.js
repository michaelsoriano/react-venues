import React from 'react';
import Data from './Data';

function getBestPhoto(bestPhoto){   
  if(bestPhoto){   
    let src = bestPhoto.prefix + '300' + bestPhoto.suffix;    
    return (<div className="best-photo"><img className="bestPhoto" src={src} alt="" /></div>)
  }else{
    return (<div className="empty-photo"></div>)
  }
  
}

function getName(theName,noresults){
  var ret = Data.itemName;
  if(theName){
    ret = theName;
  }else if(noresults){
    ret = 'No results found';
  }
  
  return ret;
}

function getDescription(desc,noresults){
  var ret = Data.descrption;
  if(desc){
    ret = desc;
  }else if(noresults){
    ret = 'Try changing your search term and / or location';
  }
  return ret;
}


function Details(props){  
    return (
            <div className="details">            
            {getBestPhoto(props.itemAddDetails.bestPhoto)}
              <div className="text-wrapper">
                <h3>{getName(props.itemAddDetails.name,props.noresults)}</h3>
                <p className="description">
                  {getDescription(props.itemAddDetails.description,props.noresults)}</p>
              </div>
            </div>)
}

export default Details;