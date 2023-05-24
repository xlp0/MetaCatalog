import { Link } from "react-router-dom";
import { theImage, priceString, convertToIPFS } from '../../hooks/formatters'
import { useState } from 'react'
import { useSelector } from "react-redux";
import {selectAllProducts} from '../../features/products/productSlice'
import  {selectDictionaryOfEffectiveChanges} from '../../features/blockchain/ethereum/ChangeSubmissionSlice'


const Products = () => {
    
    const [productNumber, setProductNumber] = useState('');

    const productList = useSelector(selectAllProducts);
    
    const priceChangeDictinoary = useSelector(selectDictionaryOfEffectiveChanges);

    const isPriceChanged = (productNumber) => {
      if (priceChangeDictinoary[productNumber]){
        return true
      }else{
        return false
      }
    }

    const latestPrice = (productNumber) => {
      if (priceChangeDictinoary[productNumber]){
        return priceChangeDictinoary[productNumber]
      }else{
        return false
      }
    }

    const products = productList?.filter( item => 
      (item?.no_produk?.toLowerCase().includes(productNumber.toLowerCase())) ||
      (item?.nama_produk?.toLowerCase().includes(productNumber.toLowerCase())) ||
      (item?.nama_manufaktur?.toLowerCase().includes(productNumber.toLowerCase())) 
    );

  return (
    <div className="products">
      <label htmlFor="name-filter">Filter by no_produk:</label>
      <input type="text" id="name-filter" value={productNumber} onChange={(e) => setProductNumber(e.target.value)} />


        {products?.map(product => (
          <div className="product_number">
            <Link to={product?.no_produk?.toString()} key={product?.no_produk}>
                <p><img className="product_avatar" src={convertToIPFS(theImage(product?.produk_gambar))} alt={convertToIPFS(theImage(product?.produk_gambar))} ></img>
                  {product?.nama_produk}</p>
                
            </Link>
            <div className="product_info">
              <div className="product_price" style={{ textDecoration: isPriceChanged(product?.no_produk?.toString()) ? 'line-through' : 'none' }}>Price: RP {priceString(product?.harga_pemerintah)}</div>  
              <div className="product_price_changed">{isPriceChanged(product?.no_produk?.toString()) ? `Latest Price:${priceString(latestPrice(product?.no_produk?.toString()))}` : " "}</div>
              <div>Made by: {product?.nama_manufaktur}</div>
              <div>TKDN(%):{product?.tkdn_produk === null ? "0.0": product?.tkdn_produk} </div>
            </div>
          </div>
        ))}
    </div>
  )
}

export default Products

