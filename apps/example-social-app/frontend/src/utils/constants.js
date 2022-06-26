export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const CHAIN = process.env.REACT_APP_CHAIN ? process.env.REACT_APP_CHAIN : process.env.NODE_ENV === 'production' ? 'polygon' : 'mumbai'