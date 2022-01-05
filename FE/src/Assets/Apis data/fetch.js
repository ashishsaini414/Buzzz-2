const setHeaders = (headers) => {
    if(localStorage.tokenDetails !== undefined){
        return {
            ...headers,
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem("tokenDetails")).tokenId}`
        }
    }
    else{
        return headers;
    }
}

export default setHeaders;