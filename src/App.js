import React from 'react';
import {  Map, TileLayer, Marker, Popup } from 'react-leaflet'; 
import axios from 'axios';
import './App.css'; 
import Loader from './Loader';
import Results from './Results';
import Search from './Search';
import Data from './Data';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      query : Data.query,
      near : Data.cities[0], 
      loading : true,
      loadingText : 'Loading',
      items : [], 
      item : {}, 
      itemAddDetails : {},
      noresults : false,
      lat: '',  
      lng: '',
      zoom: 12,     
      tileUrl : 'https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'
    };

    this.markerRefs = []; //container for all the markers - built by handleMarkerRef
    this.backendUrl = 'http://localhost:5000';

    if (process.env.NODE_ENV === 'production') {
      this.backendUrl = 'https://infinite-hollows-62870.herokuapp.com';
    }   

  }

   

  handleMarkerRef (index,node){
    this.markerRefs[index] = node;
  }

  setHeight(){
    var height = window.innerHeight + 'px';
    const css = {
      height: height 
    };
    return css;
  }

  componentDidMount() {   
    this.getResults();
  }

  getResults(){ 
    var self = this;    
    var url = self.backendUrl+'/fs/search-venues?query='+this.state.query; 
    url += '&near='+this.state.near;
     
    axios.get(url,{ crossdomain: true })
      .then(function (response) {  
        var items = response.data.response.venues; 
        
        if(items.length > 0){
          self.setState({
            loading : false,
            lat : items[0].location.lat,
            lng : items[0].location.lng,
            items : items    
          })  
          self.getDetails(0);
        }else{
          self.setState({
            lat : Data.lat,
            lng : Data.lng,
            loading: false, 
            noresults : true
          })
        }

      }).catch(function (error) {       
        console.log(error);
        console.log(error.response);
        self.setState({
          loading : true,
          loadingText : error.response.data.error,
        })
      })
  }

  getDetails(index){   
    var _this = this;
    axios.get(_this.backendUrl+'/fs/get-venue-details?id='+_this.state.items[index].id,{ crossdomain: true })
      .then(function (response) { 
        var details = response.data.response.venue;
        // console.log(details);
        _this.setState({
          itemAddDetails : details,    
          loading : false
        }, ()=>{          
            if (_this.markerRefs[index]) {
              _this.markerRefs[index].leafletElement.openPopup();
            }
          }        
        )
      }).catch(function (error) {       
        console.log(error);
        console.log(error.response);
        _this.setState({
          loadingText : error.response.data.error,
        })
      })
  }

  markerClick(index){  

    this.setState({         
        item : this.state.items[index], 
        lat : this.state.items[index].location.lat, 
        lng : this.state.items[index].location.lng, 
        loading : true
      }
    )    

    this.getDetails(index);


  }

  closePopup(){    
    this.setState({           
      item : {},
      itemAddDetails : {}      
    })
    // console.log(this.state)        
  }

  showAddress(index){ 
    var addressArr = this.state.items[index].location.formattedAddress;
    var fnlStr = '';
    for(var i=0; i<addressArr.length; i++){
      fnlStr += addressArr[i] + ' ';
    }    
    return fnlStr ? <p className="address">{fnlStr}</p> : '';
  }

  onSubmit(fields){   
    this.setState({
      query:fields.query, 
      near:fields.near,
      loading : true,    
      items : [], 
      item : {}, 
      itemAddDetails : {}
    }, ()=>{
      this.getResults();
    });
    
  }

  showIcon(index){
    var catArr = this.state.items[index].categories;
    var icon = '';
    var src = '';
    var alt = '';
    if(catArr.length > 0){
      src = catArr[0].icon.prefix + '45' + catArr[0].icon.suffix;
      alt = "Category: " + catArr[0].pluralName; 
      icon = <img className="icon" src={src} alt={alt} />
    }  
    return icon;
  }  

  render (){       
    return <div className="Map" style={this.setHeight()}> 
        <Search onSubmit={this.onSubmit.bind(this)}></Search>
        <Results 
          style={this.setHeight()}
          resultClicked={this.markerClick.bind(this)}      
          resultFormatAddress={this.showAddress.bind(this)}             
          item={this.state.item} 
          items={this.state.items}          
          itemAddDetails={this.state.itemAddDetails}  
          noresults={this.state.noresults}      
          ></Results>    
        <Loader loading={this.state.loading} text={this.state.loadingText}></Loader> 
        <Map ref={m => { this.leafletMap = m; }} 
          center={[this.state.lat, this.state.lng]} 
          zoom={this.state.zoom}>
          <TileLayer url={this.state.tileUrl}/>  
          {this.state.items.map((value, index) => {
            return (      
              <Marker      
                key={index}                     
                onclick={()=>{this.markerClick(index)}} 
                position={[value.location.lat, value.location.lng]}
                ref={this.handleMarkerRef.bind(this, index)}>   
                  <Popup >      
                    {this.showIcon(index)}
                    <h3>{value.name}</h3>
                    {this.showAddress(index)}
                  </Popup>
              </Marker>                
            )
          })}
        </Map>
        </div>
  }    
}

export default App;
