
// Get available instructions
const getLanguages = async (token) => {

  const response = await fetch('/languages.json')

  return response.json()
}



const languageService = {
  getLanguages
}

export default languageService
