import { useState } from "react";
import KeyValueList from "../../components/KeyValueList";
import { useSelector } from "react-redux";
import {selectedItem} from '../../features/items/itemSlice'
  




const Specification = () => {

  const [ productID, setProductID ] = useState(null);
  const [product, setProduct] = useState(null)
  
  const theSelectedItem = useSelector(selectedItem);

  return (
    <div>
      <h2>Specification</h2>
      <p> Product ID: {productID}</p>
      {theSelectedItem ?
        <KeyValueList dict={theSelectedItem}></KeyValueList>
        :"Empty Selected Item"
      }
    </div>
  )
}

export default Specification