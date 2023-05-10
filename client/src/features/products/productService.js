import axios from 'axios'

const API_URL = '/api/products/'
 




const register = async (productData) => {
  const response = await axios.post(API_URL, productData)

  if (response.data) {
    localStorage.setItem('product', JSON.stringify(response.data))
  }

  return response.data
}

// Login product
const login = async (productData) => {
  const response = await axios.post(API_URL + 'login', productData)

  if (response.data) {
    localStorage.setItem('product', JSON.stringify(response.data))
  }

  return response.data
}

// Logout product
const logout = () => {
  localStorage.removeItem('product')
}

const productService = {
  register,
  logout,
  login,
}

export default productService
