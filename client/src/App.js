import './App.css';
import { 
  createBrowserRouter, 
  createRoutesFromElements, 
  Route,
  RouterProvider
} from 'react-router-dom'
import Home from './pages/Home';
import About from './pages/About';

import Faq from './pages/help/Faq';
import Contact, { contactAction } from './pages/help/Contact';
import CareerDetails from './pages/careers/CareerDetails';
import Careers from './pages/careers/Careers';
import NotFound from './pages/NotFound';


// Layouts
import ProductsLayout from './layouts/ProductsLayout';
import RootLayout from './layouts/RootLayout';
import HelpLayout from './layouts/HelpLayout';
import CareersLayout from './layouts/CareersLayout';
import ProductError from './pages/products/ProductError';
import Products, { productsLoader } from './pages/products/Products';
import ProductDetails, { productDetailsLoader } from './pages/products/ProductDetails';
import AnnouncementsLayout from './layouts/AnnouncementsLayout'
import Announcements from './pages/announcements/Announcements';
import PrefetchedEvents from './pages/announcements/PrefetchedEvents';

import PublishedEvents from './pages/announcements/PublishedEvents';
import Specification from './pages/products/Specification';
import News from './pages/news/News';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="help" element={<HelpLayout />} >
            <Route path="faq" element={<Faq />} />
            <Route path="contact"  element={<Contact />} action={contactAction}/>
        </Route>
        <Route path="career" element={<CareersLayout />} >
            <Route path="careerDetails" element={<CareerDetails />} />
            <Route path="careers"  element={<Careers />} />
        </Route>
        <Route path="announcement" element={<AnnouncementsLayout />} >
            <Route path="announcements" element={<Announcements />} />
            <Route path="prefeched" element={<PrefetchedEvents />} />
            <Route path="published_events"  element={<PublishedEvents />}/>
        </Route>
        <Route path="news" element={<News />} />

        <Route path="products" element={<ProductsLayout />} errorElement={<ProductError />}>
          <Route 
            index 
            element={<Products />} 
            // loader={productsLoader}
          />
          <Route
            path=":id"
            element={<ProductDetails />} 
            >
              <Route path="specification" element={<Specification />} />
              <Route path="announcements" element={<Announcements />} />
              <Route path="published_events"  element={<PublishedEvents />}/>
          </Route>
        </Route>
        <Route path="*" element={<NotFound />}></Route>
    </Route>
  )
)

function App() {
  
  return (
      <RouterProvider router={router} />
  );
}

export default App;
