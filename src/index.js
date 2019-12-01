import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './index.css'

let dataArr = [];

const winnerData = (name) => {

    const prize = axios.get("http://api.nobelprize.org/v1/prize.json")
    //Gets the laurete data from the API

    prize.then(res => {
        name = name.trim();
        let prizeData = res.data.prizes;

        //Matches the data with name params
        let regex = new RegExp(name, "i");
        for (let i = 0; i < prizeData.length; i++) {
            if (prizeData[i].laureates) {
                prizeData[i].laureates.forEach((e) => {
                    if (e.firstname) {
                        e.firstname = e.firstname.toLowerCase()
                       if (e.firstname.match(regex)) {
                            prizeData[i].id = e.id
                            dataArr.push(prizeData[i])
                        }
                    }
                    if (e.surname) {
                        e.surname = e.surname.toLowerCase()
                        if (e.surname.match(regex)) {
                            prizeData[i].id = e.id
                            dataArr.push(prizeData[i])
                        }
                    }
                 });
               }
             }
          })
        .catch(e => {
            console.log(e)
        })

    //Gets the country data from the APi 

    let country = axios.get("http://api.nobelprize.org/v1/laureate.json")
             country.then(res => {
                dataArr.forEach(e => {
                    //Adds the country to the data
                    res.data.laureates.forEach(ele => {
                        if (ele.id == e.id) {
                            if (ele.bornCountry) {
                                e.country = ele.bornCountry
                            } else {
                                e.country = "Country not avalialble"
                            }
                        }
                    })
                })
        })
        .catch(e => {
            console.log(e)
        })
    }

const ShowData = (props) => {
    
    const data = props.data;
    if (data) {

     const view = data.map((e , i) => {
        let firstname = e.laureates.map((e) => {
            e.name = e.firstname[0].toUpperCase() + e.firstname.slice(1)
            if(e.surname) {
                e.name = e.firstname[0].toUpperCase() + e.firstname.slice(1) + " " + e.surname[0].toUpperCase() + e.surname.slice(1) 
            }
            return (
                <ul>
                    <li> {e.name} </li>
                </ul>
              )
           })
        return(
            <div className="list">
                <p> {i + 1} </p>
                <li> The Year was {e.year} </li>
                <li> The Category was {e.category} </li> 
                <li> The Country of the Winner is { e.country } </li>
                <li> The winners were {firstname} </li>
                
            </div>
           )
     });  

     //Clears the data
     dataArr = []
   return (
       <div>
           {view}
       </div>
     )
   } 
 else  {
     return null;
   }
}

const App = () => {
    const [name, getData] = useState("") 
    
    winnerData(name)    
    
    return (
        <div className="app">
            <label> Search for Winner By Name </label>
            <input type="text" value={name} onChange={(e) => getData(e.target.value)} />
            <ShowData data={dataArr}/>
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('root'));

