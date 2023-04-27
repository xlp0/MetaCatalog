import { Outlet } from 'react-router-dom'

const ProductsLayout = () => {
    return (
        <div className="product-layout">
          <Outlet />
        </div>
      )
}

export default ProductsLayout