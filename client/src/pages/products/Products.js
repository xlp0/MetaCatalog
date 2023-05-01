import { useLoaderData, Link } from "react-router-dom";
import { theImage, priceString } from '../../hooks/formatters'

const productList = require("./" +process.env.REACT_APP_SAMPLE_DATA_IN_PUBLIC_DIR)

const Products = () => {
    
    const products = useLoaderData();

  return (
    <div className="products">
        {products?.map(product => (
            <Link to={product?.no_produk?.toString()} key={product?.no_produk}>
                <p><img className="product_avatar" src={theImage(product?.produk_gambar)} alt={theImage(product?.produk_gambar)} ></img>
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
    const res = productList
    return res
    
  } catch (err) {
    console.error(err)
  }
  return null
}

