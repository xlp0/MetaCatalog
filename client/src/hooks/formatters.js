export const theImage = (imgStrArray) => {
    const theList = imageList(imgStrArray);
    return theList?.[0]
}

export const imageList = ( originalStr ) => {
    const aList = originalStr?.split("|");
    return aList;
}

export const convertToIPFS = (inputStr) => {
    const prefixStr = process.env.REACT_APP_IPFS_IMAGEFILES_LOCAL_ADDRESS
    if (inputStr === undefined){
        return null
    }
    const parts = inputStr.split("/");
    return prefixStr + parts.pop().trim() + ".png"
}

export const priceString = (aNumber) => {
    const options = { style: 'decimal', minimumFractionDigits: 0 };
    if (typeof aNumber !== "number"){
        const formattedNumber = aNumber.toLocaleString('en-US', options);
        return formattedNumber;
    }else if(typeof aNumber !== 'string'){
        const num = Number(aNumber);
        const formattedNumber = num.toLocaleString('en-US', options);
        return formattedNumber;
    }else{
        return "Input value must be a number"
    }
}

export const  shortenedAccountString = ( theString )  => {
    let str = String(theString)
    if (str.length < 20){
      return str
    }else{
      let firstPart = str.slice(0,10)
      let lastPart = str.slice(-10)
      return firstPart+ "..." + lastPart
    }
  }

