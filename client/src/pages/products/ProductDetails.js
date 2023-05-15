import { NavLink, Outlet, useLoaderData, useParams } from 'react-router-dom'
import { imageList, theImage, priceString, convertToIPFS } from '../../hooks/formatters'
import WalletConnection from '../../components/WalletConnection'
import { useSelector, useDispatch } from 'react-redux'
import {selectAllProducts} from '../../features/products/productSlice'
import  {selectItem} from '../../features/items/itemSlice'
import { store } from '../../app/store';


const ProductDetails = () => {

   const productList = useSelector(selectAllProducts);
   
   const { id } = useParams();

   const product = productList.find(product => product?.no_produk === id);

   const dispatch = useDispatch();
   dispatch(selectItem(product));
   const selectedProduct = store.someItem
   console.log("Right After CALLING DISPATCH..." + JSON.stringify(selectedProduct));
   console.dir(store.itemReducer)


  return (
    <>
    <div className ="product-details">
        <div className="topRow">
            <div>
                <img src={convertToIPFS(theImage(product?.produk_gambar))} alt={convertToIPFS(theImage(product?.produk_gambar))} className="product-details_image" ></img>
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
                ?.map( anImg => (<img src={convertToIPFS(anImg)} alt={convertToIPFS(anImg)} className="product-details_image" ></img>)
                )}
        </div>


    <div className="details"> </div>
    <p>{product?.spesifikasi}</p>
    
    <WalletConnection />
    
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
