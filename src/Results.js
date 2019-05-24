import React from 'react';
import Details from './Details';


function Tile(props){
    const curClass = props.item.id === props.currentId ? 'active tile' : 'tile';
    return <a href={'#'+props.itemIndex} 
                className={curClass} 
                onClick={(e)=>{
                    e.preventDefault();
                    props.tileClicked(props.itemIndex)
                }}>
                <h3>{props.item.name}</h3>                           
                {props.formatAddress(props.itemIndex)}                
        </a>
}


function Results(props){    
    return <div style={props.style} className="results">

            <Details 
                itemAddDetails={props.itemAddDetails}
                noresults={props.noresults}
                ></Details>          

            {props.items.map((value,index)=>{
                return(<Tile 
                        key={index}
                        itemIndex={index}
                        item={value}
                        tileClicked={props.resultClicked}
                        currentId={props.itemAddDetails.id}
                        formatAddress={props.resultFormatAddress}                         
                        ></Tile>)
            })}    
            </div>
  
}

export default Results;