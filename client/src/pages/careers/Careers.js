import { useLoaderData, Link } from "react-router-dom";
import {arrayFromStrapiAPI} from "../../hooks/useFetch";

export default function Careers(){


    const careers = useLoaderData();

  return (
    <div className="careers">
        {careers?.map(career => (
            <Link to={career?.id?.toString()} key={career?.id}>
                <p>{career?.title}</p>
                <p>Based in {career?.location}</p>
            </Link>
        ))}
    </div>
  )
}


export const careersLoader = async () => {

    const res = await arrayFromStrapiAPI("careers")

    if (res.length <= 0){
        throw Error('Could not fetch the list of careers...')
    }

    return res
}