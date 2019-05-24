import React from 'react';
import Data from './Data';
import axios from 'axios';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            query: Data.query,
            near : Data.cities[0], 
            citySuggestions : []
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.queryChanged = this.queryChanged.bind(this);
        this.nearChanged = this.nearChanged.bind(this);

        /**********NEED TO REDO THIS SECTION USING ENV ********/

        this.backendUrl = 'http://localhost:5000';

        if (process.env.NODE_ENV === 'production') {
            this.backendUrl = 'https://infinite-hollows-62870.herokuapp.com';
        } 


    }
    queryChanged(event){      
        this.setState({query:event.target.value})
    }
    nearChanged(event){    
        var self = this;
        var val = event.target.value; 

        this.setState({near:val});

        if(val.length > 3){
            axios.get(this.backendUrl+'/search-city?term='+val,{ crossdomain: true })
            .then(function (response) {               
                self.setState({
                    citySuggestions : response.data
                })
            })
            .catch(function (error) {
                console.log(error);
            })
        }else{
            self.setState({
                citySuggestions : []
            })
        }
       
    }
    handleSubmit(event){  
        if(!this.state.near || !this.state.query){
            alert('Please fill in the required fields');
        }else{
            this.props.onSubmit(this.state);
        }        
        event.preventDefault();
    }
    getCities(){
        var cities = Data.cities;
        return (
            cities.map((value,index)=>{
                return <option key={index} value={value}>{value}</option>
            })            
        )    
    }

    cityClicked(index){      
        var ct = this.state.citySuggestions[index].city;
        var st = this.state.citySuggestions[index].state;
        this.setState({
            citySuggestions : [], 
            near : ct + ', ' + st
        })
    }    

    citySuggest(){
        var self = this;
        return (<ul className="citySuggest">
                {this.state.citySuggestions.map(function(item,index){
                    return <li onClick={self.cityClicked.bind(self,index)} key={index}>
                        {item.city}, {item.state}</li>
                })} 
                </ul>)
    }

    render (){
        return <form className="search" onSubmit={this.handleSubmit}>
                    <input 
                        placeholder="Type in a Search term"
                        name="query"
                        type="text" 
                        autoComplete="off"
                        value={this.state.query}
                        onChange={this.queryChanged}
                        ></input>     

                    <input 
                        placeholder="Type in a City"
                        name="near"
                        type="text" 
                        value={this.state.near}
                        autoComplete="off"
                        onChange={this.nearChanged}
                        >
                    </input>
                    {this.citySuggest()}
                    
                    <button>Search</button>
                </form>
    }
}

export default Search;