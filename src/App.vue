<template>
  <div
    v-if="loaded"
  >
    <section>
      <goods-list/>
    </section>

    <section>
      <shopping-cart/>
    </section>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

import '@/assets/js/libs';
import {getRandomInteger, apiFetchGoods} from '@/assets/js/shared'

// components
import GoodsList from '@/components/GoodsList.vue'
import ShoppingCart from '@/components/ShoppingCart.vue'

export default {
  name: 'App',
  data() {
    return {
      loaded: false, // флаг, чтобы точно знать что на момент отображения данные существуют
      intervalToken: null // токен интервала, для отчистки после удаления компонента, можно было не делать, так как это рут компонент, но это привычка)
    }
  },
  components: {
    GoodsList,
    ShoppingCart
  },
  methods: {
    getRandomInteger,
    apiFetchGoods,
    ...mapActions([
      'FETCH_GROUPS',
      'FETCH_GOODS',
      'CONFIGURE_GOODS',
      'UPDATE_GOODS_RATE',
      'CONFIGURE_GROUPS',
      'SET_CHANGE_RATE'
    ]),
    updatePricesAndRate: function() { // метод для обновления курса и списка товаров

      this.intervalToken = setInterval(() => { // интервал

        this.loaded = false;

        this.apiFetchGoods() // запрашиваем новые данные
          .then(res => {
            this.UPDATE_GOODS_RATE({ // вызываем обновление данных
              newGoods: res, 
              newRate: this.getRandomInteger({min: 20, max: 80})
            });

            this.loaded = true;
          })
        
      }, 15000)
    }
  },
  async mounted() {
    const fetchPromises = [ // массив промисов, чтобы производить манипуляции только по резолву обоих
      this.FETCH_GOODS(),
      this.FETCH_GROUPS()
    ];

    Promise.all(fetchPromises)
      .then(() => {
        this.CONFIGURE_GOODS(); // меняем структуру товаров
        this.CONFIGURE_GROUPS(); // меняем структуру групп

        this.loaded = true;

        this.updatePricesAndRate(); // вызываем метод обновления данных с интервалом в 15 секунд
      })
  },
  beforeDestroy() {
    clearInterval(this.intervalToken) // чистим инетрвал 
  }
}
</script>

<style lang="scss">
  input {
    /* Chrome, Safari, Edge, Opera */
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Firefox */
    &[type=number] {
      -moz-appearance: textfield;
    }
  }

</style>
