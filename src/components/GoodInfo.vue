//  компонент для вывода информации о товаре
<template>
    <li
      :class="['collection-item goods__item', 
      {'teal lighten-5': goods[goodId].priceDiff < 0}, 
      {'red lighten-5': goods[goodId].priceDiff > 0}]"  
      @click="addGood(goodId)"
    ><!-- в зависимости от изменения цены вешаем класс с цветом фона -->
      {{ goods[goodId].name }} ({{ goods[goodId].quantity }})

      <div class="secondary-content">
        {{ calculatePrice({price: goods[goodId].priceUsd, changeRate}) }} руб./шт.
      </div>
    </li>  
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import {calculatePrice} from "@/assets/js/shared";

export default {
  name: 'GoodInfo',
  props: {
    goodId: String // данные о товаре мы получаем из геттеров по id товара
  },
  computed: {
    ...mapGetters({
      goods: 'GET_GOODS',
      changeRate: 'GET_CHANGE_RATE'
    }),
  },
  methods: {
    calculatePrice,
    ...mapActions({
      addGood: 'ADD_GOOD'
    })
  },
}
</script>

<style>

</style>