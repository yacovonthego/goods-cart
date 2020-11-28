<template>
  <div class="row">
    <div class="col s12">
      <table>
        <thead>
          <tr>
            <th>Наименование товара и описание</th>
            <th>Количество</th>
            <th>Цена</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(amount, goodId) of addedGoods"
            :key="goodId"
          >
            <td>
              {{goods[goodId].name}}
            </td>
            <td>
              <amount-input
                :good-id="goodId"
              />
            </td>
            <td>
              <span class="teal-text text-lighten-1">{{calculatePrice({price: goods[goodId].priceUsd, changeRate})}} руб./шт.</span> 
              
              <div 
                class="secondary-content red-text text-lighten-1 button--delete"
                @click="clearGood(goodId)"
              >
              <!-- по клику удаляется объект из корзины по id товара -->
                Удалить
              </div>             
            </td>
          </tr>
        </tbody>

        <tfoot>
          <td class="total" colspan="3">Общая стоимость: <span class="teal-text text-lighten-1">{{calculatePrice({price: totalPrice, changeRate})}} руб./шт.</span></td>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {calculatePrice} from "@/assets/js/shared";
import AmountInput from "@/components/AmountInput";

export default {
  name: 'ShoppingCart',
  components: {
    AmountInput
  },
  computed: {
    ...mapGetters({
      addedGoods: 'GET_ADDED_GOODS',
      changeRate: 'GET_CHANGE_RATE',
      goods: 'GET_GOODS',
      totalPrice: 'GET_TOTAL_PRICE'
    })
  },
  methods: {
    calculatePrice,
    ...mapActions({
      clearGood: 'CLEAR_GOOD',
      calculateTotalPrice: 'CALCULATE_TOTAL_PRICE'
    })
  },
  created() {
    this.calculateTotalPrice();
  }
}
</script>

<style lang="scss" scoped>
  .button {

    &--delete {
      cursor: pointer;
    }
  }

  .amount {
    max-width: 5rem;
  }

  .total {
    text-align: right;
  }
</style>