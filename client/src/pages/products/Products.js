import { useLoaderData, Link } from "react-router-dom";
import { arrayFromStrapiAPI } from '../../hooks/useFetch'
import { theImage, priceString } from '../../hooks/formatters'

const Products = () => {
    
    const products = useLoaderData();

  return (
    <div className="products">
        {products?.map(product => (
            <Link to={product?.id?.toString()} key={product?.id}>
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

    const res = await arrayFromStrapiAPI("produks")

    if (res.length <= 0){
        throw Error('Could not fetch the list of products...')
    }

    return res
}

