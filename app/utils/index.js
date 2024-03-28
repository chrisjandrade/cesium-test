
export const randomNum = (max) =>
    Math.random() * max + 1;

export const randomLong = () => {
    let long = randomNum(180);
    return Math.random() > 0.5 ? long : -long;
};

export const randomLat = () => {
    let lat = randomNum(90);
    return Math.random() > 0.5 ? lat : -lat;
};

export const getViewerFromRef = (ref) => 
    ref?.current?.cesiumElement;

export const getUUID = () => crypto.randomUUID();

export const openExternalWindow = (url, searchParams, features) => {
    features = features || {
        toolbar: 'no',
        menubar: 'no',
        height: `${window.innerHeight * 0.75}`,
        width: `${window.innerWidth * 0.5}`
    };

    const featuresString = Object.keys(features).
        map(key => `${key}=${features[key]}`).
        join(',');

    window.open(`${url}?${searchParams.toString()}`, '_blank', featuresString);    
};

export const randomFromList = (values = []) => 
    values[Math.floor(Math.random() * values.length - 1)];

export const properCase = (str = '') => `${str.substring(0, 1).toUpperCase()}${str.substring(1, str.length)}`; 