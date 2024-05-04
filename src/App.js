import React, { useState, useEffect, useCallback } from "react";
import { Grid } from "@mui/material";

function DisplayGrid({ data }) {
  return (
    <div>
      <Grid container justifyContent="center" alignItems="center" spacing={{ xs: 2, md: 3 }}>
        {(data != null) && data.map((country, index) => (
          <Grid item xs={12 / 2} sm={12 / 3} md={12 / 4} lg={12 / 7} xl={1} key={index}>
            <div style={{ border: '1px solid #ccc', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px' }}>
              <div className="countryCard" style={{ textAlign: 'center' }}>
                <div style={{ width: '100px', height: '50px' }}>
                  <img src={country.flags.png} alt={country.name.common} style={{ maxWidth: '100%', height: '100%' }} />
                </div>
                <span>{country.name.common}</span>
              </div>
            </div>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

async function fetchData() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    if (response.status !== 200) {
      throw new Error("An error occurred while loading");
    }
    return await response.json();
  } catch (error) {
    console.error("An error occurred while loading the data from backend:", error);
    return null;
  }
}

function App() {
  const [data, setData] = useState(null);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState(null);

  const filterData = useCallback((search, data) => {
    if (!data) return null;
    if (!search) return data;
    const filteredData = data.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase()));
    return filteredData;
  }, []);

  useEffect(() => {
    const fetchDataAndFilter = async () => {
      try {
        const info = await fetchData();
        if (info) {
          setData(info);
          setFilteredData(filterData(search, info));
        } else {
          console.error("An error occurred while loading data");
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    fetchDataAndFilter();
  }, [search, filterData]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  return (
    <div>
      <center>
        <input style={{ marginTop: "30px", textAlign: "center", position: "fixed" }} type="text" placeholder="Search for countries..." onChange={handleSearchChange} />
      </center>
      {data && <DisplayGrid data={filteredData} />}
    </div>
  );
}

export default App;
