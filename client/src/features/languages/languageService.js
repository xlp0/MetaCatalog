
// Get available instructions
const getLanguages = async () => {
  try {
    const response = await fetch('/languages.json')
    const data = await response.json();
    console.log("Data from launch time", data)
    return data
  } catch (error){
    console.error(error);
  }
}

const languageService = {
  getLanguages
}

export default languageService
