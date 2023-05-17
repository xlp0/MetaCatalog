import { Link } from "react-router-dom";
import { theImage, priceString, convertToIPFS } from '../../hooks/formatters'
import { useState } from 'react'
import { useSelector } from "react-redux";
import {selectAllProducts} from '../../features/products/productSlice'

const Products = () => {
    
    const [productNumber, setProductNumber] = useState('');

    const productList = useSelector(selectAllProducts);
    
    const products = productList?.filter( item => 
      (item?.no_produk?.toLowerCase().includes(productNumber)) ||
      (item?.nama_produk?.toLowerCase().includes(productNumber)) ||
      (item?.nama_manufaktur?.toLowerCase().includes(productNumber)) 
    );

  return (
    <div className="products">
      <label htmlFor="name-filter">Filter by no_produk:</label>
      <input type="text" id="name-filter" value={productNumber} onChange={(e) => setProductNumber(e.target.value)} />


        {products?.map(product => (
            <Link to={product?.no_produk?.toString()} key={product?.no_produk}>
                <p><img className="product_avatar" src={convertToIPFS(theImage(product?.produk_gambar))} alt={convertToIPFS(theImage(product?.produk_gambar))} ></img>
                  {product?.nama_produk}, Made by: {product?.nama_manufaktur}</p>
                <p>TKDN(%):{product?.tkdn_produk === null ? "0.0": product?.tkdn_produk} </p>
                <p>Price: RP {priceString(product?.harga_pemerintah)}</p>
            </Link>
        ))}
    </div>
  )
}

export default Products

