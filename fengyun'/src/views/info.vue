<template>
  <div class="content-wrapper">
    <div class="content">
      <div class="top">
        <div class="time_top">
          <div class="switch">
            <div :class="switch_val==1?'total fefbb1':'total'" @click="switchVal(1)">总榜</div>
            <div :class="switch_val==2?'day fefbb1':'day'" @click="switchVal(2)">日榜</div>
          </div>
          <van-button class="button" @click="showHideOnBlur = true">活动规则</van-button>
        </div>
      </div>
      <div class="ranking_banner">
        <img
          :src="switch_val==1?require('@/assets/images/bg_ranking_total.png'):require('@/assets/images/bg_ranking_day.png')"
          alt="">
      </div>
      <div class="ranking">
        <div class="today_money">
          <p>{{switch_val==1?'我的累计出借金额：':'我的今日出借金额：'}}{{ lendMoney || '0.00' }}元</p>
          <p @click="toPast" v-if="switch_val==2">往日排名&nbsp;>></p>
        </div>
        <p class="money_ranking">{{switch_val==1?'排名数据实时更新，最终结果以实时数据为准':'排名结果以最终数据为准'}}</p>
        <div class="ranking-content">
          <table>
            <thead>
              <th>排名</th>
              <th>手机号</th>
              <th>认购金额</th>
              <th>可获得奖品</th>
            </thead>
            <tbody :class="switch_val==1?'tbody_total':'tbody_day'">
              <tr v-for="(item, index) in rankingList" :key="index">
                <td v-if="index === 0" class="img"><img src="../assets/images/Champion.png" alt="">{{index+1}}</td>
                <td v-else-if="index === 1 && switch_val==1" class="img"><img src="../assets/images/Runner-up.png"
                    alt="">{{index+1}}
                </td>
                <td v-else-if="index === 2 && switch_val==1" class="img"><img src="../assets/images/thirdplace.png"
                    alt="">{{index+1}}
                </td>
                <td v-else>{{index+1}}</td>
                <td class="phone"><img src="../assets/images/self.png" class="self" v-if="item.isMe">{{item.phone}}</td>
                <td>{{(item.money).toFixed(2)}}</td>
                <td v-if="switch_val==2">
                  {{ index === 0 ? '1200': (index === 1 ? '1000' : (index === 2 ? '800' : ( index === 3 || index === 4 ? '500' : '300'))) }}元京东购物卡
                </td>
                <td v-if="switch_val==1">
                  {{ index === 0 ? '7000': (index === 1 ? '4700' : (index === 2 ? '3700' : ( index >=3 && index <=9 ? '2700' : ( index >=10 && index <=19 ? '2000' : (index >=20 && index <=29 ?'1200' : (index >=30 && index <=39 ?'1000' : (index >=40 && index <=49 ? '700' : (index >=50 && index <=59 ? '500' :'300')))))))) }}元京东购物卡
                </td>
              </tr>
              <tr v-if="rankingList.length != 0" class="nolist">
                <td>暂无数据</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="text" v-if="switch_val==1">
          <span>排名自2019年9月29日 0:00起</span>
        </div>
      </div>
      <div class="distr">
        <span>网贷有风险 出借需谨慎</span>
      </div>
      <van-dialog v-model="showHideOnBlur" :showConfirmButton="false" :closeOnClickOverlay="true">
        <div class="title">
          <div>
            <span>活动规则</span>
            <img src="../assets/images/icon_Close.png" alt="" @click="showHideOnBlur = false">
          </div>
        </div>
        <div class="dialogContent">
          <div class="content">
            <span>1、活动时间：2019年09月29日0:00:00-2019年10月7日23:59:59</span>
            <span>2、国庆风云榜分为活动期间的总排行榜（简称“总榜”）和每日排行榜（简称“日榜”）。</span>
            <span>3、活动期间总榜的前70名用户和日榜的前10名用户均可获得奖励（若出借金额相同时，以出借时间较早者优先排名获奖），每日排名将于当日0:00更新，可点击“查看往期排名”，查看中奖记录。</span>
            <span>4、兑奖时间为2019年10月9日-2019年10月12日16点，和掌柜客服将每日通知前一日中奖用户信息，并于国庆节后统一兑奖，若超过活动兑奖时间，恕不兑奖。</span>
            <span>5、本活动最终解释权归成都融证通互联网信息服务有限公司所有，活动期间若发现任何非正常获利行为，有权取消其活动资格。</span>
            <span>6、如有疑问请致电和掌柜客服电话400-020-0178或添加和掌柜客服微信号（a139lc）进行咨询。</span>
          </div>
        </div>
      </van-dialog>
    </div>
  </div>
</template>
<script>
  import request from '../utils/request.js'
  import {
    Toast,
    Loading
  } from 'vant';
  export default {
    components: {},
    data() {
      return {
        showHideOnBlur: false,
        rankingList: [],
        nowMonth: '',
        nowDay: '',
        lendMoney: '', //我的出借金额
        switch_val: 1
      }
    },
    methods: {
      switchVal(val) {
        Toast.loading({
          mask: true,
          duration: 0
        });
        this.switch_val = val
        this.request_data()

      },
      toPast() {
        this.$router.push('/past')
      },
      request_data() {
        this.nowMonth = new Date().getMonth() + 1
        this.nowDay = new Date().getDate()

        let month = this.nowMonth
        let day = this.nowDay
        if (this.nowMonth < 10) {
          month = '0' + this.nowMonth
        }
        if (this.nowDay < 10) {
          day = '0' + this.nowDay
        }
        if (this.switch_val == 1) {
          request({
            url: 'auth/rank/queryRankTotal',
            data: `2019${month}${day}`
          }).then(data => {
            Toast.clear()
            this.rankingList = data.result.ls
            this.lendMoney = data.result.money
          })
        } else {
          // 出借前十排名
          request({
            url: 'auth/rank/queryRank',
            data: `2019${month}${day}`
          }).then(data => {
            Toast.clear()
            this.rankingList = data.result.ls
            this.lendMoney = data.result.money
          })
        }
      }
    },
    mounted() {
      if (!window.localStorage.getItem('tokenB')) {
        this.$router.push('/login')
      }
      this.request_data()
    },
  }

</script>
<style lang="less" scoped>
  .content-wrapper {
    min-height: 100vh;
    width: 100vw;
    background: url('../assets/images/bg3.png') no-repeat center center;
    background-size: 100% 100%;
    display: flex;
    align-items: flex-start;
    font-size: 28px;
    padding: 0 14px;

    .content {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      .top {
        margin-bottom: 20px;
        width: 99%;

        .time_top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 96px;

          .switch {
            display: flex;

            .total,
            .day {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 182px;
              height: 82px;
              background: #f4cf79;
            }

            .fefbb1 {
              background: #fefbb1;
            }

            .total {
              border-bottom-left-radius: 20px;
            }

            .day {
              border-bottom-right-radius: 20px;
            }
          }

          .van-button {
            background: #a0100a;
            color: #fff;
            border: none;
            width: 180px;
            height: 60px;
            border-radius: 180px;
            font-size: 26px;
          }
        }
      }

      .ranking_banner {
        margin-top: 20px;
        width: 648px;
        height: 80px;

        img {
          width: 100%;
          height: 100%;
        }
      }


      .ranking {
        margin: 32px -20px 0px -20px;

        .text {
          margin-top: 22px;
          display: flex;
          justify-content: flex-end;
          font-size: 22px;
          color: #fcfcc1;
        }

        .today_money {
          p {
            margin: 0;
          }

          width: 685px;
          display: flex;
          justify-content: space-between;
          padding-bottom: 20px;
          color: #ffffff;
        }

        .money_ranking {
          text-align: right;
          margin: 0;
          color: #ffffff;
          margin-bottom: 26px;
          font-size: 24px;
        }

        .ranking-content {
          background: #f8eae7;
          width: 685px;
          padding: 20px 20px 0 20px;
          border-radius: 20px;

          table {
            width: 100%;
            border-collapse: collapse;
            margin: 0 auto;
            text-align: center;

            thead {
              border-bottom: 1px solid #DFDED8;
              display: flex;

              th {
                display: flex;
                align-items: center;
                height: 80px;
                color: #333;
                font-size: 24px;
                font-weight: normal;
                height: 80px;
              }

              th:nth-of-type(1) {
                display: flex;
                justify-content: flex-end;
                width: 98px;
              }

              th:nth-of-type(2) {
                width: 158px;
                display: flex;
                justify-content: center;
              }

              th:nth-of-type(3) {
                width: 160px;
                display: flex;
                justify-content: center;
              }

              th:nth-of-type(4) {
                width: 228px;
                display: flex;
                justify-content: center;
              }
            }

            tbody {
              tr {
                display: block;
                width: 100%;

                td:nth-of-type(1) {
                  width: 98px;
                }

                td:nth-of-type(2) {
                  width: 158px;
                }

                td:nth-of-type(3) {
                  width: 160px;
                }

                td:nth-of-type(4) {
                  width: 228px;
                }
                border-bottom: 1px solid #DFDED8;

                &:last-of-type {
                  border: none;
                }

                td {
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
                  &:nth-child(2) {
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
                  color: #333;
                  font-size: 24px;
                  font-weight: normal;
                  height: 80px;
                }
              }
            }

            .tbody_total {
              display: block;
              width: 100%;
              max-height: 900px;
              overflow-y: auto;
              .nolist{
                td{
                  display: block;
                  width: 100%;
                  padding: 0;
                  line-height: 80px;
                }
              }
              tr:nth-of-type(1),
              tr:nth-of-type(2),
              tr:nth-of-type(3) {
                td {
                  color: #000000;
                  font-weight: bold;
                }
              }
            }

            .tbody_day {
              width: 100%;
              .nolist{
                td{
                  display: block;
                  width: 100%;
                  padding: 0;
                  line-height: 80px;
                }
              }
              tr:nth-of-type(1) {
                td {
                  color: #000000;
                  font-weight: bold;
                }
              }
            }

            // th,
            // td {
            //   color: #333;
            //   font-size: 24px;
            //   font-weight: normal;
            //   height: 80px;
            //   // border: 1px solid;
            // }

            // th,
            // td {
            //   color: #767676;

            //   &:first-child {
            //     // text-align: right;
            //     padding-left: 48px;

            //     &.img {
            //       width: 100px;
            //       position: relative;

            //       >img {
            //         position: absolute;
            //         left: 0;
            //         top: 16px;
            //         width: 50%;
            //       }
            //     }
            //   }

            //   &:nth-child(2) {
            //     &.phone {
            //       position: relative;

            //       >img {
            //         position: absolute;
            //         left: -8px;
            //         top: 50%;
            //         transform: translateY(-50%);
            //         width: 22px;
            //       }
            //     }
            //   }

            // }

            // th {
            //   color: #000;
            // }
          }
        }
      }

      .distr {
        color: #fcfcc1;
        padding-top: 30px;
        font-size: 26px;
        line-height: 66px;
        padding-bottom: 40px;
      }
    }
  }

  /deep/.van-dialog {
    border-radius: 8px;
    width: 88%;

    .title {
      margin: 12px 0px;
      font-size: 36px;
      line-height: 36px;
      color: #333;
      border-bottom: 1px solid#e4ece9;

      &>div {
        text-align: center;
        padding: 22px 0px;
        margin: 0 22px;
        position: relative;

        >img {
          position: absolute;
          top: 16px;
          right: 0;
          width: 7%;
        }
      }
    }

    .dialogContent {
      margin: 30px;

      .content {
        font-size: 26px;
        line-height: 1.8em;
        color: #767676;
        text-align: left;
        margin-top: 36px;
        display: flex;
        justify-content: center;
        align-items: flex-start;
      }
    }
  }

</style>
