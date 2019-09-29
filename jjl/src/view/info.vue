<template>
  <div class="info">
    <div class="banner">
      <img src="@/assets/img/theme2.png" alt="">
    </div>
    <div class="time">
      <img src="@/assets/img/time.png" alt="">
    </div>
    <div class="roll" v-if="zj_list.length > 0">
      <ul :class="{anim:animate}">
        <li v-for='(item, index) in zj_list' :key="index">{{item}}</li>
      </ul>
    </div>
    <p class="money">出借总额:{{money}}元<span>（自2019年9月29日 0:00开始）</span></p>
    <div class="progress">
      <div class="progress-wrapper">
        <div class="yellow_bg" :style="{width:width}">
          <img src="@/assets/img/jdt.png" alt="">
        </div>
        <div class="stars">
          <div class="stars_big_div" v-for="(item, index) in list" :key="index">
            <div class="aaa">
              <div :class="(item.type==2 || item.type==0)?'small_stars_div':'big_stars_div'">
                <img :class="(item.type==2 || item.type==0)?'small_stars':'big_stars'"
                  :src="item.type==2?require('@/assets/img/gary_stars.png'):item.type==1?require('@/assets/img/big_stars.png'):require('@/assets/img/small_stars.png')"
                  alt="" @click="submit(index)">
              </div>
            </div>

            <p>{{item.money}}</p>
          </div>


        </div>
      </div>
    </div>
    <div class="rules_money">
      <div class="rules" @click="showHideOnBlur=true">活动规则</div>
      <div class="content">
        <div class="title">
          <p>认购金额</p>
          <p>可领取总金额</p>
        </div>
        <ul>
          <li>
            <div>3万</div>
            <div>50元</div>
          </li>
          <li>
            <div>6万</div>
            <div>100元</div>
          </li>
          <li>
            <div>9万</div>
            <div>150元</div>
          </li>
          <li>
            <div>12万</div>
            <div>200元</div>
          </li>
        </ul>
      </div>
    </div>
    <div class="lq_record">
      <img src="@/assets/img/title.png" alt="">
    </div>
    <p class="get_money">已领取总额：{{total_money}}元</p>
    <div class="no_record" v-if="receiveLogs.length===0">暂无领取记录</div>
    <div class="record" v-else>
      <div class="content">
        <div class="title">
          <p>金额</p>
          <p>时间</p>
        </div>
        <ul>
          <li v-for="(item, index) in receiveLogs" :key="index">
            <div>{{item.money}}</div>
            <div>{{item.time}}</div>
          </li>
        </ul>
      </div>
    </div>
    <p class="tips">网贷有风险 出借需谨慎</p>
    <van-popup v-model="showHideOnBlur">
      <div class="dialogContent">
        <div class="title">
          <span>活动规则</span>
          <div class="img">
            <img src="@/assets/img/icon_Close.png" alt="" @click="showHideOnBlur = false">
          </div>

        </div>
        <div class="content">
          <span>1、活动时间：2019年9月29日0:00:00-2019年10月7日23:59:59。</span><br>
          <span>2、活动期间每达到认购金额档位，可点亮五角星，领取奖励。</span><br>
          <span>3、兑奖时间为2019年10月9日-2019年10月12日16点，用户请联系和掌柜客服进行兑奖，若超过活动兑奖时间，恕不兑奖。</span><br>
          <span>4、本活动最终解释权归成都融证通互联网信息服务有限公司所有，活动期间若发现任何非正常获利行为，本公司有权取消其活动资格。</span>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
  import request from '@/utils/request.js'
  import {
    Dialog,
    Popup,
    Notify,
    Loading,
    Toast
  } from 'vant';
  export default {
    components: {
      'van-popup': Popup
    },
    data() {
      return {
        total_money: 0,
        showHideOnBlur: false,
        flag: false,
        zj_list: ['* 暂无数据 *'],
        animate: false,
        money: 0,
        waitReceiveMoney: 0, //用户以领了钱
        list: [{
            money: '0',
            type: 0
          },
          {
            money: '3万',
            type: 2
          },
          {
            money: '6万',
            type: 2
          },
          {
            money: '9万',
            type: 2
          },
          {
            money: '12万',
            type: 2
          }
        ],
        width: '0%',
        receiveLogs: [],
        total_money: 0
      }
    },
    created() {
      request({
        url: 'auth/rich/queryReceiveLog'
      }).then(data => {
        this.waitReceiveMoney = data.result.waitReceiveMoney
        let totalMoney = 0
        data.result.receiveLogs.forEach(item => {
          this.receiveLogs.push({
            money: item.receive,
            time: this.formatDate(item.createAt, 'yyyy/MM/dd hh:mm')
          })
          totalMoney = item.receive + totalMoney
        });
        this.total_money = totalMoney
        this.money = data.result.money
        this.createdMethod()
      })

      request({
        url: 'auth/rich/queryReceiveLogRanking'
      }).then(data => {
        if (data.result.length > 0) {
          this.zj_list = []
          data.result.forEach(item => {
            this.zj_list.push(`* 用户${item.registerPhone}已领取${item.receive}元京东购物卡 *`)
          })
        }
      })
      window.scroll = setInterval(this.scroll, 1500)
    },
    methods: {
      padLeftZero(str) {
        return ('00' + str).substr(str.length);
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
      createdMethod() {
        this.width = `${(this.money/120000)*100}%`
        let count = parseInt(this.money / 30000)
        if (this.money >= 30000 && this.money < 60000) {
          if (this.waitReceiveMoney == 0) {
            this.list[1].type = 0
          } else {
            this.list[1].type = 1
          }
        } else if (this.money >= 60000 && this.money < 90000) {
          if (this.waitReceiveMoney == 0) {
            this.list[1].type = 0
            this.list[2].type = 0
          } else if (this.waitReceiveMoney == 50) {
            this.list[1].type = 0
            this.list[2].type = 1
          } else {
            this.list[1].type = 1
            this.list[2].type = 1
          }
        } else if (this.money >= 90000 && this.money < 120000) {
          if (this.waitReceiveMoney == 0) {
            this.list[1].type = 0
            this.list[2].type = 0
            this.list[3].type = 0
          } else if (this.waitReceiveMoney == 50) {
            this.list[1].type = 0
            this.list[2].type = 0
            this.list[3].type = 1
          } else if (this.waitReceiveMoney == 100) {
            this.list[1].type = 0
            this.list[2].type = 1
            this.list[3].type = 1
          } else {
            this.list[1].type = 1
            this.list[2].type = 1
            this.list[3].type = 1
          }
        } else if (this.money >= 120000) {
          if (this.waitReceiveMoney == 0) {
            this.list[1].type = 0
            this.list[2].type = 0
            this.list[3].type = 0
            this.list[4].type = 0
          } else if (this.waitReceiveMoney == 50) {
            this.list[1].type = 0
            this.list[2].type = 0
            this.list[3].type = 0
            this.list[4].type = 1
          } else if (this.waitReceiveMoney == 100) {
            this.list[1].type = 0
            this.list[2].type = 0
            this.list[3].type = 1
            this.list[4].type = 1
          } else if (this.waitReceiveMoney == 150) {
            this.list[1].type = 0
            this.list[2].type = 1
            this.list[3].type = 1
            this.list[4].type = 1
          } else {
            this.list[1].type = 1
            this.list[2].type = 1
            this.list[3].type = 1
            this.list[4].type = 1
          }
        }
      },
      submit(click_index) {
        if (click_index == 0) {
          return
        }
        let obj = this.list[click_index]
        if (obj.type == 0) {
          Dialog.alert({
            message: '你已经领过了喔～'
          }).then(() => {
            // on close
          })
          return
        }
        if (obj.type == 2) {
          Dialog.alert({
            message: '您还未达到当前领取资格,请继续加油喔'
          }).then(() => {
            // on close
          })
          return
        }
        let a = 0
        this.list.forEach((item, index) => {
          if (index < click_index && item.type == 1) {
            if (item.type == 1) {
              a++
              return
            }
          }
        })
        if (a > 0) {
          Dialog.alert({
            message: '请按档位顺序依次领取'
          }).then(() => {
            // on close
          })
          return
        }
        Toast.loading({
          mask: true,
          duration: 0
        });
        request({
            url: 'auth/rich/addAddress',
            data: {
              regionId: this.areaId,
              addressDetail: this.addressDetail,
              receivingName: this.receivingName,
              receivingPhone: this.receivingPhone,
              receivingType: this.imgUrl
            }
          })
          .then(data => {
            if (data.success) {
              this.list[click_index].type = 0
              this.receiveLogs = []
              request({
                url: 'auth/rich/queryReceiveLog'
              }).then(data => {
                Toast.clear()
                this.waitReceiveMoney = data.result.waitReceiveMoney
                let totalMoney = 0 //已领取变量
                data.result.receiveLogs.forEach(item => {
                  this.receiveLogs.push({
                    money: item.receive,
                    time: this.formatDate(item.createAt, 'yyyy/MM/dd hh:mm')
                  })
                  totalMoney = item.receive + totalMoney
                });
                this.total_money = totalMoney
                this.money = data.result.money
              })
              Dialog.alert({
                title: '恭喜你，获得50元京东购物卡',
                message: '请于2019年10月8日-2019年10月11日16点联系和掌柜微信客服（a139lc）进行兑奖'
              }).then(() => {

              })
            } else {
              Toast.clear()
              Notify({
                type: 'danger',
                message: data.errorDescription || '系统繁忙',
                duration: 2000
              });
            }
          }).catch(() => {
            Toast.clear()
            Notify({
              type: 'danger',
              message: data.errorDescription || '系统繁忙',
              duration: 2000
            });
          })


      },
      scroll() {
        if (this.zj_list.length === 1) {
          return
        }
        this.animate = true; // 因为在消息向上滚动的时候需要添加css3过渡动画，所以这里需要设置true
        setTimeout(() => {
          this.zj_list.push(this.zj_list[0]); // 将数组的第一个元素添加到数组的
          this.zj_list.shift(); //删除数组的第一个元素
          this.animate = false; // margin-top 为0 的时候取消过渡动画，实现无缝滚动
        }, 500)
      },
    }
  }

</script>

<style scoped lang="less">
  .info {
    display: flex;
    flex-flow: column;
    align-items: center;
    min-height: 100vh;
    background: url('../assets/img/bg2.png') center center no-repeat;
    background-size: 100% 100%;

    .banner {
      padding-top: 130px;
      width: 691px;
      height: 193px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .time {
      margin: 76px 0 20px;
      width: 641px;
      height: 56px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .roll {
      background: #fffbb2;
      margin: 0 auto 64px;
      font-size: 28px;
      line-height: 70px;
      color: #fff;
      border-radius: 40px;
      width: 670px;
      height: 70px;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      position: relative;

      ul {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        text-align: center;

        li {
          // background: url(../assets/images/tag.png) no-repeat;
          // background-size: 100% 100%;
          color: #e04f25;
          font-size: 28px;
          line-height: 80px;
        }
      }

      .anim {
        transition: all .5s;
        margin-top: -80px;
        overflow: hidden;
      }
    }

    .money {
      color: #ffffff;
      font-size: 28px;

      span {
        font-size: 26px;
      }
    }

    .progress {
      margin-bottom: 60px;

      .progress-wrapper {
        width: 660px;
        height: 28px;
        background: url('../assets/img/jdt_gary.png')center center no-repeat;
        background-size: 100% 100%;
        margin: 40px;
        position: relative;

        .yellow_bg {
          padding: 3px 0 0 7.5px;
          height: 21px;
          display: flex;
          max-width: 645px;
          justify-content: center;
          align-content: center;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .stars {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: -40px;

          .stars_big_div {
            display: flex;
            flex-flow: column;
            justify-content: center;
            align-items: center;

            &>div {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 57px;

              .small_stars {
                height: 100%;
                width: 100%;
              }

              .big_stars {
                width: 100%;
                height: 100%;
              }
            }

            .big_stars_div {
              width: 62px;
              height: 57px;
            }

            .small_stars_div {
              width: 40px;
              height: 36px;
            }

            p {
              color: #eded00;
              padding-top: 21px;
            }
          }

          &>div:first-child {
            margin-left: -8px;
          }

          &>div:last-child {
            margin-right: -22px;
          }
        }
      }
    }

    .rules_money {
      width: 690px;
      background: #faeae8;
      position: relative;

      .rules {
        position: absolute;
        right: 0;
        top: 0;
        width: 28px;
        padding: 27px 16px 27px 18px;
        font-size: 24px;
        line-height: 1.3;
        background: #e04f25;
        border-bottom-left-radius: 40px;
        color: #fff;
      }

      .content {
        padding: 0 76px 0 36px;

        .title {
          height: 100px;
          line-height: 100px;
          display: flex;
          justify-content: space-around;
          border-bottom: 2px solid #e8a09f;
        }

        ul {
          padding-bottom: 20px;

          li {
            height: 100px;
            line-height: 100px;
            display: flex;
            justify-content: space-around;
          }
        }
      }
    }

    .lq_record {
      margin: 50px 0 0 0;
      width: 692px;
      height: 32px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .get_money {
      line-height: 100px;
      width: 690px;
      text-align: left;
      color: #ffffff;
      font-weight: bold;
      font-size: 36px;
    }

    .no_record {
      line-height: 100px;
      width: 690px;
      text-align: center;
      background: #faeae8;
      margin-bottom: 42px;
    }

    .record {
      width: 690px;
      background: #faeae8;
      position: relative;
      margin-bottom: 42px;

      .content {
        padding: 0 76px 0 36px;

        .title {
          height: 100px;
          line-height: 100px;
          display: flex;
          justify-content: space-around;
          border-bottom: 2px solid #e8a09f;
        }

        ul {
          padding-bottom: 20px;

          li {
            height: 100px;
            line-height: 100px;
            display: flex;
            justify-content: space-around;

            div {
              width: 50%;
              text-align: center;
            }
          }
        }
      }
    }

    .tips {
      font-size: 28px;
      color: #ffffff;
      padding-bottom: 120px;
    }

    .van-popup {
      width: 80%;
      border-radius: 20px;

      .dialogContent {
        margin: 20px 0;

        .title {

          text-align: center;
          font-size: 44px;
          line-height: 44px;
          padding: 22px 10px;
          color: #333;
          border-bottom: 1px solid#ccc;
          position: relative;

          .img {
            position: absolute;
            top: 16px;
            right: 24px;
            width: 44px;
            height: 44px;

            img {
              width: 100%;
              height: 100%;
            }
          }

        }

        .content {
          padding: 0 29px;
          font-size: 26px;
          line-height: 1.8em;
          color: #767676;
          text-align: left;
          margin-top: 36px;
        }

        >.tip {
          font-size: 26px;
          line-height: 1.8em;
          color: #767676;
          text-align: left;
          margin-top: 36px;
          margin-bottom: 60px;
        }
      }
    }

  }

</style>
