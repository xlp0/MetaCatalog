import {useEffect, useState} from 'react'

const useFetch = (urlParamStr) => {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const baseURL = process.env.REACT_APP_API_URL;

    useEffect(() => {

    const fetchData = async () => {
        setLoading(true)
        try {
            const res = await fetch(baseURL + "/" + urlParamStr);
            const json = await res.json();
            const arrayContent = flattenAttributeData(json)
            setData(arrayContent)                
        } catch (err){
            //console.log(err);
            setError(true);
        }
            setLoading(false);
        }
        fetchData();
    }, [baseURL, urlParamStr]);
        
    return {data, loading, error}
}

 const flattenAttributeData = (fetchedData) => {
    const flattened = [];
    // Get the keys to extract from the first object in the fetchedData array
    const extractedAttributeKeys = Object.keys(fetchedData.data[0].attributes);

    fetchedData.data.forEach((item) => {
      const itemObj = {};
  
      // Extract the desired keys and their values from the attributes object
      extractedAttributeKeys.forEach((key) => {
        itemObj[key] = item.attributes[key];
      });
  
      // Add the id as a separate key
      itemObj.id = item.id;
  
      flattened.push(itemObj);
    });
    return flattened;
  }

  export const flattenAttributeRecord = (fetchedData) => {  
    // Get the keys to extract from the first object in the data array
    const extractedAttributeKeys = Object.keys(fetchedData?.data?.attributes);

    const recordObj = {};
  
      // Extract the desired keys and their values from the attributes object
      extractedAttributeKeys.forEach((key) => {
        recordObj[key] = fetchedData.data.attributes[key];
      });
  
      // Add the id as a separate key
      recordObj.id = fetchedData?.data?.id;

    return recordObj;
  }



  export const arrayFromStrapiAPI = async (urlParamStr) => {
    try {
      const baseURL = process.env.REACT_APP_API_URL;

      const res = await fetch(baseURL + "/" + urlParamStr);
      if (!res.ok) {
        throw new Error(`Failed to fetch ${baseURL}: ${res.statusText}`);
      }
      const jsonData = await res.json();
      const arrayContent = flattenAttributeData(jsonData)
      return arrayContent;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  export const recordFromStrapiAPI = async (urlParamStr, id) => {
    try {
      const baseURL = process.env.REACT_APP_API_URL;
      const res = await fetch(baseURL + "/" + urlParamStr + "/" +id);
      if (!res.ok) {
        throw new Error(`Failed to fetch ${baseURL} with ID ${id}: ${res.statusText}`);
      }

      const json = await res.json();

      const recordContent = flattenAttributeRecord(json)
      return recordContent;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }


export default useFetch;

