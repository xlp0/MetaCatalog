import React from 'react'

const known_categories = [
    {
      title: 'National Product Showcase',
      imgSrc: '/img/k-nasional.svg',
      alt: 'National',
      categoryName: 'National',
    },
    {
      title: 'Local Product Showcase',
      imgSrc: '/img/k-lokal.svg',
      alt: 'Local',
      categoryName: 'Local',
    },
    {
      title: 'Sectoral Product Showcase',
      imgSrc: '/img/k-sektoral.svg',
      alt: 'Sectoral',
      categoryName: 'Sectoral',
    },
    {
      title: 'SME Product Showcase',
      imgSrc: '/img/k-ukm.svg',
      alt: 'UMKK',
      categoryName: 'UMKK',
    },
    {
      title: 'Innovation Product Showcase',
      imgSrc: '/img/k-inovasi.svg',
      alt: 'Innovation',
      categoryName: 'Innovation',
    },
    {
      title: 'TKDN',
      imgSrc: '/img/bbi.svg',
      alt: 'TKDN',
      categoryName: 'TKDN',
    },
  ];
  
  function Category({ title, imgSrc, alt, categoryName }) {
    const [selected, setSelected] = React.useState(false);
    return (
      <div
        className="NAV_BOX"
        title={title}
        onClick={() => setSelected(!selected)}
        style={{ opacity: selected ? 0.5 : 1 }}
      >
        <div className="comp-category">
          <img src={imgSrc} alt={alt} />
          <h4 className="title-category">{categoryName}</h4>
        </div>
      </div>
    );
  }
  

const ShowCaseBanner = ({ categories }) => { 
  categories = known_categories
  return (
    <div className="NAV_WRAPPER">
      {categories.map((category, index) => (
        <React.Fragment key={index}>
          <Category {...category} />
          {index < categories.length - 1 && <span/>}
        </React.Fragment>
      ))}
    </div>
  );
}

export default ShowCaseBanner  
  
  
  