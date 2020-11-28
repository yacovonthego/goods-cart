import Vue from 'vue'
import Vuex from 'vuex'

// user imports
import {apiFetchGoods, apiFetchGroups} from '@/assets/js/shared';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    goods: [],
    groups: {},
    changeRate: 10,
    totalPrice: 0,
    addedGoods: {}
  },
  mutations: {
    // исопльзую set для добавления новых рекативных полей внутри объектов
    SET_GOODS: (state, {goods}) => Vue.set(state, 'goods', goods),
    SET_GROUPS: (state, {groups}) => Vue.set(state, 'groups', groups),
    ADD_GOOD: (state, goodId) => {
      if (Object.keys(state.addedGoods).includes(goodId)) { // если товар уже в корзине добавляем количество
        state.addedGoods[goodId]++;
      } else {
        Vue.set(state.addedGoods, goodId, 1) // если нет, добавяляю в корзину 
      }
    },
    CLEAR_GOOD: (state, goodId) => Vue.delete(state.addedGoods, goodId), // delete использую также чтобы поддерживать реактивность
    SET_AMOUNT: (state, {goodId, amount}) => {
      state.addedGoods[goodId] = amount;
    },
    SET_TOTAL_PRICE: (state, totalPrice) => state.totalPrice = totalPrice,
    SET_CHANGE_RATE: (state, changeRate) => state.changeRate = changeRate,
  },
  actions: {
    FETCH_GOODS: async ({commit}) => {
      const goods = await apiFetchGoods();

      commit('SET_GOODS', {goods})     
      
      return true;
    },
    FETCH_GROUPS: async ({commit}) => {
      const groups = await apiFetchGroups();

      commit('SET_GROUPS', {groups})       
      
      return true;
    },
    CONFIGURE_GOODS: ({commit, state}) => {
      // решил изменить структуру хранения товаров и услуг для более простого понимания (в json названия полей не очень информативны)

      const goodsObj = {};

      for (const item of state.goods) {
          Object.assign(goodsObj, { // решил использовать именно такую структу для упрощенного доступа по id товара
              [item.T]: { // данные забираю по id товара из объекта групп (пока что с неизмененной структурой)
                name: state.groups[String(item.G)].B[item.T].N,
                groupId: String(item.G),
                groupName: state.groups[String(item.G)].G,
                priceUsd: item.C,
                quantity: item.P
              }
          })
      }

      commit('SET_GOODS', {goods: goodsObj});
    },
    CONFIGURE_GROUPS: ({commit, state}) => {

      const groupsObj = {};

      for (const [index, item] of Object.entries(state.groups)) {

        const goodsObj = {};

        let isGoodsAvailable = false; // флаг наличия товара из группы в data.json

        for (const [goodId, goodData] of Object.entries(item.B)) {
          
          if (Object.keys(state.goods).includes(goodId)) { // такая структура была выбрана, чтобы при обновлении данных, можно было получить новую цену 
            Object.assign(goodsObj, {
              [goodId]: goodData.N
            })

            isGoodsAvailable = true;
          } 
        }

        if (isGoodsAvailable) { // добавляю товар в группу, только если он есть в data.json

          Object.assign(groupsObj, {
            [index]: { // ключом является id группы
              groupName: item.G,
              goods: goodsObj
            }
          })
        }
      }

      commit('SET_GROUPS', {groups: groupsObj})     
    },
    UPDATE_GOODS_RATE: ({commit, dispatch, state}, {newGoods, newRate}) => {
      // действие исключительно для того чтобы высчитывать разницу в ценах
      // так как при обновлении списка товаров инстанса объекта товара уже может не существовать, 
      // т.е. watch на цену не повесить

      const goodsObj = {};

      for (const item of newGoods) {
          Object.assign(goodsObj, {
              [item.T]: { // ключ id товара
                name: state.groups[String(item.G)].goods[item.T],
                groupId: String(item.G),
                groupName: state.groups[String(item.G)].G,
                priceUsd: item.C,
                priceDiff: (item.C * newRate > state.goods[item.T].priceUsd * state.changeRate) 
                ? 1 
                : ((item.C * newRate < state.goods[item.T].priceUsd * state.changeRate) ? -1 : 0),
                quantity: item.P
              }
          })
      }

      commit('SET_GOODS', {goods: goodsObj});
      commit('SET_CHANGE_RATE', newRate);
      dispatch('CALCULATE_TOTAL_PRICE'); // при каждом изменении полей влияющих на цену, пересчитывается итоговая стоимость в корзине
    },
    ADD_GOOD: ({commit, dispatch}, goodId) => {
      commit('ADD_GOOD', goodId);
      dispatch('CALCULATE_TOTAL_PRICE');
    },
    CLEAR_GOOD: ({commit, dispatch}, goodId) => {
      commit('CLEAR_GOOD', goodId);
      dispatch('CALCULATE_TOTAL_PRICE');
    },
    SET_AMOUNT: ({commit, dispatch}, {goodId, amount}) => {
      commit('SET_AMOUNT', {goodId, amount});
      dispatch('CALCULATE_TOTAL_PRICE');
    },
    CALCULATE_TOTAL_PRICE: ({commit, state}) => {

      let totalPrice = 0;

      for (const [goodId, amount] of Object.entries(state.addedGoods)) {
        totalPrice += state.goods[goodId].priceUsd * amount
      }
      
      commit('SET_TOTAL_PRICE', totalPrice)
    },
    SET_CHANGE_RATE: ({commit, dispatch}, changeRate) => {
      commit('SET_CHANGE_RATE', changeRate);
      dispatch('CALCULATE_TOTAL_PRICE');
    }
  },
  getters: {
    GET_GOODS: state => state.goods,
    GET_GROUPS: state => state.groups,
    GET_CHANGE_RATE: state => state.changeRate,
    GET_ADDED_GOODS: state => state.addedGoods,
    GET_TOTAL_PRICE: state => state.totalPrice
  },
})
 