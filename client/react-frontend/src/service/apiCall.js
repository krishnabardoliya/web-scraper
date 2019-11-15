// Root api
import { ROOT_API } from "../config/config";
import axios from 'axios';

export const getAnalysedData = async(url) => {
      return await axios.post(`${ROOT_API}/scrape`, { url });
}