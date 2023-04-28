import { useLoaderData } from 'react-router-dom'
import {recordFromStrapiAPI} from '../../hooks/useFetch'

const CareerDetails = () => {

    const career = useLoaderData()


  return (
    <div className ="career-details">
        <h2>Career Details for {career?.title}</h2>    
        <p>Starting Salary {career?.salary}</p>    
        <p>Location {career?.location}</p>    

        <div className="details"> </div>
        <p>{career?.details}</p>
    </div>
  )
}

export default CareerDetails

// loader functions
export const careerDetailsLoader = async ( {params} ) => {
    const { id } = params

    const res = await recordFromStrapiAPI('careers' , id)
    if (null === res){
      throw Error('Could not fetch details...')
    }
    return res
}