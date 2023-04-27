import { NavLink, Outlet, useLoaderData } from 'react-router-dom'
import {recordFromStrapiAPI} from '../../hooks/useFetch'
import { imageList, theImage, priceString } from '../../hooks/formatters'

const ProductDetails = () => {

   const product = useLoaderData()

  return (
    <>
    <div className ="product-details">
        <div className="topRow">
            <div>
                <img src={theImage(product?.produk_gambar)} alt={theImage(product?.produk_gambar)} className="product-details_image" ></img>
            </div>

            <div>
                <h2>{product?.nama_produk}</h2>  
                <p> Product No.:{product?.no_produk}</p>      
                <p>Price: RP {priceString(product?.harga_pemerintah)}</p>    
                <p>Total Stock: {product?.jumlah_stok}</p>    
            </div>
            
        </div>
        <div className="image_row">
                {imageList(product?.produk_gambar)
                ?.map( anImg => (<img src={anImg} alt={anImg} className="product-details_image" ></img>)
                )}
        </div>


    <div className="details"> </div>
    <p>{product?.spesifikasi}</p>
    </div>
        <div className="product-details-layout">
        <nav>
            <NavLink to="specification">Specification</NavLink>
            <NavLink to="announcements">Announcements</NavLink>
            <NavLink to="published_events">Published Events</NavLink>
        </nav>
        <Outlet someProp={12343243} />
    </div>
</>



  )
}

export default ProductDetails

// loader functions
export const productDetailsLoader = async ( {params} ) => {
    const { id } = params

    const res = await recordFromStrapiAPI('produks' , id)
    if (null === res){
      throw Error('Could not fetch product details...')
    }
    return res
}
