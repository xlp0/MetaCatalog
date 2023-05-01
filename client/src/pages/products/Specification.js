import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import KeyValueList from "../../components/KeyValueList";
const productList = require("./" + process.env.REACT_APP_SAMPLE_DATA_IN_PUBLIC_DIR)

const Specification = () => {

  const location = useLocation();
  const [ productID, setProductID ] = useState(null);
  const [product, setProduct] = useState(null)


  useEffect( () => {

    const fetchData = async () => {
      let pageLocation = location;
      const theID = pageLocation.pathname.split('/')[2];
      setProductID(theID);
      let aProduct = await fetchProductDetails(theID);
      setProduct(aProduct);
    };

    fetchData();
  }, [location])

  return (
    <div>
      <h2>Specification</h2>
      <p> Product ID: {productID}</p>
      <KeyValueList dict={product}></KeyValueList>

    </div>
  )
}

export default Specification

export const fetchProductDetails = async ( id ) => {
  const product = productList.find(product => product.no_produk === id);
  console.log("id passed in:" + id)
  return product
}