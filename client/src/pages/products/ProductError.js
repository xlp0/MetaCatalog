import { Link, useRouteError } from 'react-router-dom'

const ProductError = () => {
  
  const error = useRouteError();

  return (
    <div className="products-error">
    <h2>Error</h2>
    <p>{error.message}</p>
    <Link to="/">Back to Home Page</Link>
</div>
  )
}

export default ProductError