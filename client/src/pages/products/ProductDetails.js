import { NavLink, Outlet, useParams } from 'react-router-dom'
import { imageList, theImage, priceString, convertToIPFS } from '../../hooks/formatters'
import WalletConnection from '../../components/WalletConnection'
import { useSelector, useDispatch } from 'react-redux'
import {selectAllProducts} from '../../features/products/productSlice'
import  {selectItem} from '../../features/items/itemSlice'
import  {selectDictionaryOfEffectiveChanges} from '../../features/blockchain/ethereum/ChangeSubmissionSlice'
import {useEffect, useState} from 'react'


const ProductDetails = () => {

   const productList = useSelector(selectAllProducts);


   const { id } = useParams();

   const product = productList.find(product => product?.no_produk === id);

   // Must dispatch the selectItem(product) function to make sure that the global state is set to this selectedItem.
   const dispatch = useDispatch();
   dispatch(selectItem(product));

   const priceChangeDictinoary = useSelector(selectDictionaryOfEffectiveChanges);
   const [isPriceChanged, setIsPriceChanged] = useState(false);
   const [newPrice, setNewPrice] = useState(0);


   useEffect(() => {

   if (priceChangeDictinoary[product?.no_produk]){
    setNewPrice(priceChangeDictinoary[product?.no_produk]);
    setIsPriceChanged(true)
}
    console.log("UseEffect called in ProductDetails");
   }, [isPriceChanged, newPrice,priceChangeDictinoary, product])

  return (
    <>
    <div className ="product-details">
        <div className="topRow">
            <div>
                <img src={convertToIPFS(theImage(product?.produk_gambar))} alt={convertToIPFS(theImage(product?.produk_gambar))} className="product-details_image" ></img>
            </div>

            <div>
                <h2>{product?.nama_produk}</h2>  
                <p>Product No.:{product?.no_produk}</p>      
                <p>Price: RP {priceString(product?.harga_pemerintah)}{isPriceChanged 
                    ? <p style={{ fontSize: "15px", color: "red" }} >PRICE CHANGED:{priceString(newPrice)}</p> 
                    : <p style={{ fontSize: "15px", color: "blue" }}>Original Price</p>}</p>                 
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
