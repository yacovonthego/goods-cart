import axios from 'axios';

const apiFetchGoods = async () => {
    try {
        const res = await (await axios.get('/data/data.json'));
        
        return res.data.Value.Goods;
    } catch(e) {
        console.log(e);
    }
}

const apiFetchGroups = async () => {
    try {
        const res = await axios.get('/data/names.json');

        return res.data;
    } catch(e) {
        console.log(e);
    }
}

const calculatePrice = ({price, changeRate}) => Number((price * changeRate).toFixed(2)) 
// хелпер для подсчета цены в рублях и обрезания лишних знаков у чисел с плавающей точкой

const getRandomInteger = ({min, max}) => Math.floor(min + Math.random() * (max + 1 - min))

export {apiFetchGoods, apiFetchGroups, calculatePrice, getRandomInteger};