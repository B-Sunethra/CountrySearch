import React from "react";
import {useEffect,useState} from "react";
import { Grid} from "@mui/material";
import { useCallback } from 'react';


function DisplayGrid({data})
{
    return(
        <div>
            <Grid container justifyContent="center" alignItems="center" spacing={{ xs: 2, md: 3 }}>
                {(data!=null) && data.map((_, index) => (
                        <Grid item xs={12/2} sm={12/3} md={12/4} lg={12/7} xl={1} key={index} >
                            <div style={{ border: '1px solid #ccc',borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px' }}>
                                <div class="countryCard" style={{ textAlign: 'center' }}>
                                    <div style={{ width: '100px', height: '50px' }}>
                                        <img src={data[index].flags.png} alt={data[index].name.common} style={{ maxWidth: '100%', height: '100%' }}/>
                                    </div>
                                    <span >{data[index].name.common}</span>
                                </div>
                            </div>
                        </Grid>
                ))}
            </Grid>
        </div>
    )
}
async function fetchData()
{
    try
    {
        const response=await fetch("https://restcountries.com/v3.1/all");
        if(response.status!==200)
        {
            console.log("An error occured while loading");
            return;
        }
        let response_json=await response.json();
        return response_json;
    }
    catch(error)
    {
        console.log("An error occured while loading the data from backend");
        // throw error;
    }

}
function App()
{
    const [data,setData]=useState(null);
    const [search,updateSearch]=useState('');
    const [filteredData,setFilteredData]=useState();


    // Inside your component
const filterData = useCallback(() => {
  const filtered_data = (search && data) ? data.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase())) : data;
  setFilteredData(filtered_data);
}, [search, data, setFilteredData]);

    useEffect(()=>{
        async function getData()
        {
            try{
                let info=await fetchData();
                if(info==null)
                {
                    console.log("An error occured");
                }
                setData(info);
                filterData();
            }
            catch(error)
            {
                console.log("some error occured while loading data",error);
                // throw error;
            }
        }
        try{
            getData();
        }
        catch{
            console.log("an error occured");
        }
        
    },[search,data, filterData])

    
    

    return(
        <div>
            <center><input style={{marginTop:"30px", textAlign:"center", position:"fixed"}}type="text" placeholder="Search for countries..." onChange={(event)=>{updateSearch(event.target.value);filterData();}} /></center>
            {data && <DisplayGrid data={filteredData}/>}
        </div>
    );
}
export default App;
