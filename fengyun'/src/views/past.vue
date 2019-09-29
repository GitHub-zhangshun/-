<template>
<!-- 往日排名 -->
  <div class="content-wrapper">
    <!-- <img src="../assets/images/bg1.png" alt=""> -->
    <div class="content">
      <div class="timePick">
          <p>日期</p>
          <p class="time" @click="toShowDate">{{ selectedDate }}</p>
      </div>
      <!-- <div class="ranking_banner">
        <img src="../assets/images/bg_ranking_total.png" alt="">
      </div> -->
      <div class="ranking">
        <div class="today_money">
          <p>当日出借金额：{{ lendMoney || '0.00' }}元</p>
        </div>
        <div class="ranking-content">
          <table>
            <thead>
              <th>排名</th>
              <th>手机号</th>
              <th>认购金额</th>
              <th>可获得奖品</th>
            </thead>
            <tbody>
              <tr v-for="(item, index) in rankingList" :key="index">
                <td v-if="index === 0" class="img"><img src="../assets/images/Champion.png" alt="">{{index+1}}</td>
                <td v-else-if="index === 1" class="img"><img src="../assets/images/Runner-up.png" alt="">{{index+1}}</td>
                <td v-else-if="index === 2" class="img"><img src="../assets/images/thirdplace.png" alt="">{{index+1}}</td>
                <td v-else>{{index+1}}</td>
                <td class="phone"><img src="../assets/images/self.png" v-if="item.isMe">{{item.phone}}</td>
                <td>{{(item.money).toFixed(2)}}</td>
                <td>{{ index === 0 ? '1200': (index ===1? '1000' : (index === 2? '800' : ( index === 4 || index === 3 ? '500' : '300'))) }}元京东购物卡</td>
              </tr>
              <tr v-if="rankingList.length == 0">
                <td colspan="4">暂无往日排名</td>     
              </tr>
            </tbody>
          </table>
        </div>
        <!-- <div class="text">
          <span>活动排名结果以最终数据为准</span>
        </div> -->
      </div>
      <div class="distr">
        <span>网贷有风险 出借需谨慎</span>
      </div>
    </div>

    <!-- 时间选择弹出层 -->
    <van-popup v-model="showDate" position="bottom" >
        <van-datetime-picker
        v-model="currentDate"
        type="date"
        :max-date="maxDate"
        :min-date="minDate"
        @cancel="showDate = false"
        @confirm="chooseDate"
        />
    </van-popup>
  </div>
</template>
<script>
  import request from '../utils/request.js';
  import { Popup, DatetimePicker } from 'vant';
  export default {
    components: {
        'van-popup': Popup,
        'van-datetime-picker': DatetimePicker,
    },
    data() {
      return {
        rankingList: [],
        showDate:false,
        currentDate: new Date(),
        minDate: new Date(2019,8,9),   //修改为9月9号
        maxDate: '',  //当天减一天
        selectedDate:'', //选择的时间
        Date:'',  //传后台时间
        lendMoney:''  //我的出借金额
      }
    },
    methods:{
        chooseDate(val){
            this.selectedDate = this.formatDate(val, 'yyyy-MM-dd')
            this.Date = this.formatDate(val, 'yyyyMMdd')

            this.getList()

            this.showDate = false
        },
        formatDate(tap, fmt) {
          var tap = Number(tap)
          if (!tap) {
              return;
          }
          var date = new Date(tap);
          if (/(y+)/.test(fmt)) {
              fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
          }
          let o = {
              'M+': date.getMonth() + 1,
              'd+': date.getDate(),
              'h+': date.getHours(),
              'm+': date.getMinutes(),
              's+': date.getSeconds()
          };
          for (let k in o) {
              if (new RegExp(`(${k})`).test(fmt)) {
                  let str = o[k] + '';
                  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : this.padLeftZero(str));
              }
          }
          return fmt;
      },
      padLeftZero(str) {
        return ('00' + str).substr(str.length);
      },
      getList(){
        // 出借前十五排名
        request({
          url: 'auth/rank/queryRank',
          data: this.Date
        }).then(data => {
          this.rankingList = data.result.ls
          this.lendMoney = data.result.money
          console.log(this.rankingList)
        })
      },
      toShowDate(){
        if(this.formatDate(new Date(),'yyyyMMdd') !== '20190909' && this.formatDate(new Date(),'yyyyMMdd') !== '20190908'){
          this.showDate = true
        }
      }
    },
    mounted() {
      if (!window.localStorage.getItem('tokenB')) {
        this.$router.push('/login')
      }

      let now = new Date()
      this.selectedDate = this.formatDate(now.setDate(now.getDate()-1),'yyyy-MM-dd')
      this.Date = this.formatDate(now,'yyyyMMdd')
      
      this.maxDate = now

      this.getList()
   },
  }

</script>
<style lang="less" scoped>
  .content-wrapper {
    min-height: 100vh;
    max-width: 100vw;
    width: 100vw;
    background: url('../assets/images/bg4.png') no-repeat center center;
    background-size: 100% 100%;
    display: flex;
    align-items: flex-start;
    font-size: 28px;
    padding: 0 30px;

    .content {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center; 
    flex-direction: column;
    position: relative;

    .timePick{
        p{
            margin: 0;
            color: #ffffff;
        }
        position: absolute;
        top: 44px;
        left: 34px;
        display: flex;
        align-items: center;
        color: #974736;
        font-size: 34px;
        .time{
            width: 300px;
            height: 64px;
            background: rgba(255,255,255,.8);
            border: 2px solid #fff;
            border-radius: 10px;
            margin-left: 20px;
            color: #333;
            font-size: 28px;
            line-height: 64px;
            text-align: center;
        }
    }
    .ranking_banner{
      margin-top: 154px;
      width: 414px;
      height: 82px;
      img{
        width: 100%;
        height: 100%;
      }
    }

    .ranking {
        margin: 154px -20px 0px -20px;
        .text {
          margin-top: 38px;
          display: flex;
          justify-content: flex-end;
          font-size: 22px;
          
        }
        
        .today_money{
          color: #daffc6;
          p{
            margin: 0;
          }
          width: 685px;
          display: flex;
          justify-content: space-between;
          padding-bottom: 32px;
        }

        .ranking-content {
          background: #f8eae7;
          border-radius: 20px;
          width: 685px;
          padding: 20px 20px 0 20px;
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 0 auto;
            text-align: center;
            // border: 1px solid;
            thead{
              border-bottom: 1px solid #DFDED8;
            }
            tr{
              border-bottom: 1px solid #DFDED8;
              &:last-of-type{
                border: none;
              }
            }

            th,td {
              color: #333;
              font-size: 24px;
              font-weight: normal;
              height: 80px;
              // border: 1px solid;
            }

            th,td {
              color: #767676;

              &:first-child {
                // text-align: right;
                padding-left: 48px;

                &.img {
                  width: 100px;
                  position: relative;

                  >img {
                    position: absolute;
                    left: 0;
                    top: 16px;
                    width: 50%;
                  }
                }
              }

              &:nth-child(2){
                &.phone {
                  position: relative;
                  >img {
                    position: absolute;
                    left: -8px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 22px;
                  }
                }
              }

            }
            th{
              color: #000;
            }
          }
        }
      }

      .distr {
        color: #daffc6;
        padding-top: 40px;
        font-size: 28px;
        line-height: 66px;
        padding-bottom: 40px;
      }
    }
  }
    // 选择时间
    /deep/.van-popup{
        padding: 0;
        .van-picker__toolbar{
            height: 90px;
            line-height: 90px;
            .van-picker__cancel, .van-picker__confirm{
                padding: 0 30px;
                font-size: 28px;
                &:active{
                    background: #e2e2e2;
                }
            }
        }
        .van-picker__columns{
            height: 400px !important;
            .van-picker-column{
                height: 80px;
                font-size: 28px !important;
            }
        }
    }


</style>
