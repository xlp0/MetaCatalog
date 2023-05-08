import { useLoaderData, Link } from "react-router-dom";
import { theImage, priceString, convertToIPFS } from '../../hooks/formatters'
import { useState } from 'react'

const productList = require("./" +process.env.REACT_APP_SAMPLE_DATA_IN_PUBLIC_DIR)


const Products = () => {
    
    const [productNumber, setProductNumber] = useState('');

    const allProducts = useLoaderData();
    
    const products = allProducts.filter( item => item?.no_produk?.toLowerCase().includes(productNumber));

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

export const productsLoader = async () => {

  console.log("productsLoader running")

  try {
    // Fetch data from URL
    const response = await fetch(`https://ipfs.io/ipfs/${process.env.REACT_APP_IPFS_CID}?filename=${process.env.REACT_APP_IPFS_FILENAME}`)
    const laptops = await response.json()      // Flatten data
    const flattenedLaptops = laptops.map((laptop) => {return laptop?.data;})
    return flattenedLaptops;
  } catch (err) {
    console.error(err)
  }
  return null
}

