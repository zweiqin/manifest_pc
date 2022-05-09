<template>
  <div class="attendance">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- s搜索区 -->
        <div class="container">
          <el-form inline size="small" :label-position="labelPosition">

            <el-form-item label="考勤门店：">
              <el-select
                v-model="attendanForm.mer_id"
                placeholder="请选择"
                class="selWidth"
                @change="get_list(1)"
              >
                <el-option label="所有门店" value="0"></el-option>
                <el-option
                  v-for="item in mer_list"
                  :key="item.mer_id"
                  :label="item.mer_name"
                  :value="item.mer_id">
                </el-option>
              </el-select>
            </el-form-item>

          </el-form>
        </div>
        <!-- e搜索区 -->
      </div>
      <div class="table_top">
        <el-button type="info"  @click="attend_click()">考勤汇总</el-button>
        <div class="right">
          {{ $moment(date).format('MM') }}月{{$moment(date).format('DD')}}日 - {{$moment(date).add(6, 'days').format('MM')}}月{{ $moment(date).add(6, 'days').format('DD') }}日
          <el-button-group>
            <el-button type="info" size="small" icon="el-icon-arrow-left" @click="getLastWeek"></el-button>
            <el-button type="info" size="small" @click="getNextWeek"><i class="el-icon-arrow-right el-icon--right"></i></el-button>
          </el-button-group>
          <el-button type="info" @click="on_week" style="height: 33px;line-height:12px;margin-left: 10px">本周</el-button>
        </div>
      </div>
      <!-- s表格 -->
      <el-table :data="tableData.data" style="width: 100%" size="small" highlight-current-row
                :header-cell-style="{background:'#52575C',color:'#FFFFFF',borderTop:'1px solid #4A4E53'}"
                :cell-style="{borderRight:'1px solid #E4EAF0', position:'relative',height:'70px'}"
                empty-text="当前门店未创建任何员工或未排班或未设置班次的上班时间，请联系门店处理">
        <el-table-column prop="real_name" label="员工" min-width="100" align="center"/>
      <!--<el-table @cell-click="cell_click" :data="tableData.data" style="width: 100%" size="small" highlight-current-row-->
      <!--          :header-cell-style="{background:'#52575C',color:'#FFFFFF',borderTop:'1px solid #4A4E53'}"-->
      <!--          :cell-style="{borderRight:'1px solid #E4EAF0', position:'relative',height:'70px'}"-->
      <!--          empty-text="当前门店未创建任何员工或未排班或未设置班次的上班时间，请联系门店处理">-->
      <!--  <el-table-column prop="real_name" label="员工" min-width="100" align="center"/>-->


        <!-- 每个星期几的标签都判断一下是否就是今天，如果是，则标签后边判断加上(今日) -->
        <el-table-column prop="mon" :label="date==$moment().format('yyyy-MM-DD') ? date + '\n 周一(今天)' : date + '\n 周一' " min-width="100" align="center">
          <template slot-scope="scope">
            <span class="cell_rt">{{get_workname(scope.row,0,1)}}</span>
            <div>
              {{get_workname(scope.row,0,0)}}
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="tues" :label="$moment(date).add(1, 'days').format('yyyy-MM-DD')==$moment().format('yyyy-MM-DD')?$moment(date).add(1, 'days').format('yyyy-MM-DD')+ '\n 周二(今天)' : $moment(date).add(1, 'days').format('yyyy-MM-DD')+ '\n 周二'" min-width="100" align="center">
          <template slot-scope="scope">
            <span class="cell_rt">{{get_workname(scope.row,1,1)}}</span>
            <div>
              {{get_workname(scope.row,1,0)}}
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="wed" :label="$moment(date).add(2, 'days').format('yyyy-MM-DD')==$moment().format('yyyy-MM-DD')?$moment(date).add(2, 'days').format('yyyy-MM-DD')+ '\n 周三(今天)' : $moment(date).add(2, 'days').format('yyyy-MM-DD')+ '\n 周三'" min-width="100" align="center">
          <template slot-scope="scope">
            <span class="cell_rt">{{get_workname(scope.row,2,1)}}</span>
            <div>
              {{get_workname(scope.row,2,0)}}
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="thur" :label="$moment(date).add(3, 'days').format('yyyy-MM-DD')==$moment().format('yyyy-MM-DD')?$moment(date).add(3, 'days').format('yyyy-MM-DD')+ '\n 周四(今天)' : $moment(date).add(3, 'days').format('yyyy-MM-DD')+ '\n 周四'" min-width="100" align="center">
          <template slot-scope="scope">
            <span class="cell_rt">{{get_workname(scope.row,3,1)}}</span>
            <div>
              {{get_workname(scope.row,3,0)}}
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="fri" :label="$moment(date).add(4, 'days').format('yyyy-MM-DD')==$moment().format('yyyy-MM-DD')?$moment(date).add(4, 'days').format('yyyy-MM-DD')+ '\n 周五(今天)' : $moment(date).add(4, 'days').format('yyyy-MM-DD')+ '\n 周五'" min-width="100" align="center">
          <template slot-scope="scope">
            <span class="cell_rt">{{get_workname(scope.row,4,1)}}</span>
            <div>
              {{get_workname(scope.row,4,0)}}
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="sat" :label="$moment(date).add(5, 'days').format('yyyy-MM-DD')==$moment().format('yyyy-MM-DD')?$moment(date).add(5, 'days').format('yyyy-MM-DD')+ '\n 周六(今天)' : $moment(date).add(5, 'days').format('yyyy-MM-DD')+ '\n 周六'" min-width="100" align="center">
          <template slot-scope="scope">
            <span class="cell_rt">{{get_workname(scope.row,5,1)}}</span>
            <div>
              {{get_workname(scope.row,5,0)}}
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="sun" :label="$moment(date).add(6, 'days').format('yyyy-MM-DD')==$moment().format('yyyy-MM-DD')?$moment(date).add(6, 'days').format('yyyy-MM-DD')+ '\n 周日(今天)' : $moment(date).add(6, 'days').format('yyyy-MM-DD')+ '\n 周日'" min-width="100" align="center">
          <template slot-scope="scope">
            <span class="cell_rt">{{get_workname(scope.row,6,1)}}</span>
            <div>
              {{get_workname(scope.row,6,0)}}
            </div>
          </template>
        </el-table-column>

      </el-table>
      <!-- e表格 -->
    </el-card>

    <!-- s考勤汇总 -->
    <el-dialog :close-on-click-modal="false" title="考勤汇总" :visible.sync="attend_sum_visibile" width="60%">

      <!-- s搜索区 -->
      <div class="container">
        <el-form inline size="small" :label-position="labelPosition">

          <el-form-item label="考勤门店：">
            <el-select
              v-model="attenSumForm.mer_id"
              clearable
              placeholder="请选择"
              class="selWidth"
              @change="get_sum_list(1)"
            >
              <el-option label="所有门店" value=""></el-option>
              <el-option
                v-for="item in mer_list"
                :key="item.mer_id"
                :label="item.mer_name"
                :value="item.mer_id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="日期：" prop="selDate">
            <el-date-picker
              v-model="attenSumForm.date"
              type="month"
              :clearable = false
              placeholder="选择月"
              value-format="yyyy-MM"
              @change="get_sum_list(1)"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <!-- e搜索区 -->
      <el-button type="text" @click="download" style="float: right">下载考勤汇总</el-button>
      <!-- s表格 -->
      <el-table :data="sumTableData.data" style="width: 100%" size="small" highlight-current-row>

        <el-table-column prop="real_name" label="员工" min-width="100" />

        <el-table-column prop="mer_name" label="门店" min-width="100" />

        <el-table-column prop="normal_count" label="正常(天)" min-width="100" />

        <el-table-column prop="beLate_count" label="迟到(次)" min-width="100" />

        <el-table-column prop="missingCard_count" label="漏打卡(次)" min-width="100" />

        <el-table-column prop="absenteeism_count" label="旷工(次)" min-width="100" />

        <el-table-column prop="askForLeave_count" label="请假(次)" min-width="100" />

        <el-table-column prop="workbegin_count" label="上班补卡(次)" min-width="100" />

        <el-table-column prop="workend_count" label="下班补卡(次)" min-width="100" />

      </el-table>

      <div class="block">
        <el-pagination
          :page-sizes="[20, 40, 60, 80]"
          :page-size="attenSumForm.limit"
          :current-page="attenSumForm.page"
          layout="total, sizes, prev, pager, next, jumper"
          :total="sumTableData.total"
          @size-change="sum_handle_size_change"
          @current-change="sum_page_change"
        />
      </div>
      <!-- e表格 -->

      <div slot="footer" class="dialog-footer">
        <!--<el-button @click="attend_sum_visibile = false" size="small">关闭</el-button>-->
      </div>
    </el-dialog>
    <!-- e考勤汇总 -->

    <!-- s点击单元格改变班次状态 -->
    <el-dialog title="" :visible.sync="status_visibile" width="20%" :close-on-click-modal="false" custom-class="status_dialog">

      <el-radio v-model="status_radio" label="1" border>正常</el-radio>
      <el-radio v-model="status_radio" label="2" border>请假</el-radio>
      <el-radio v-model="status_radio" label="3" border>休息</el-radio>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="status_submit">确定</el-button>
      </div>
    </el-dialog>
    <!-- e点击单元格改变班次状态 -->
  </div>
</template>
<script>
import getDate from "@/utils/getDate.js";
import moment from "moment";
// import { get_admin_worktime } from "@/api/user";
import { checkNullObj } from "@/utils";
// import { mer_search } from "@/api/merchant";
import { download_admin_work, get_admin_work_count } from "@/api/admin";
export default {
  name: 'attendance',
  data() {
    return {
      mer_list:[],
      mer_flag:0,
      formLabelWidth: '120px',
      labelPosition: 'right',
      attendanForm: {
        mer_id: '0',
        range:''
      },
      date: '',
      nowWeekStart: '',
      nowWeekEnd: '',
      tableData: {
        data: [],
        total: 0
      },
      // 表格头部
      // day_start: '10月18日',
      // day_end: '10月24日',
      // 考勤汇总
      attend_sum_visibile: false,
      sumTableData: {
        data: [],
        total: 0
      },
      attenSumForm: {
        page: 1,
        limit: 20,
        mer_id: '',
        date: '',
      },
      // 点击单元格修改状态
      status_visibile: false,
      status_radio: '1',
    }
  },
  created() {
  },
  mounted() {
    //设置moment的本周第一天为周一
    this.$moment.lang('zh-cn', {
      week: {
        dow: 1//Monday is the first day of the week
      }
    });
    this.$nextTick(function(){
      let my_date = []
      //仅在整个视图都被渲染之后才会运行的代码
      this.date = this.$moment().weekday(0).format('yyyy-MM-DD')
      my_date.push(this.date)
      let last_date = moment(this.date).add(6,'days').format('yyyy-MM-DD')
      my_date.push(last_date)
      this.attendanForm.range = my_date.join('.')
    })
    this.get_mer_list()
    this.get_list('')
  },
  methods: {
    attend_click(){
      this.attend_sum_visibile = true
      this.attenSumForm.date = moment().format('yyyy-MM')
      this.get_sum_list()
    },
    get_mer_list(){
      // mer_search({page:1,limit:'',search:''})
      //   .then(res => {
      //     this.mer_list = res.data.items
      //   })
      //   .catch(err => {
      //     this.$message.error(err.data.data)
      //   })
    },
    get_workname(row,week,flag){
      if(this.tableData.data.length > 0){
        if(flag == 0){
          return checkNullObj(row.worktime_list[week]) ? '无记录' : row.worktime_list[week].work_title
        }else{
          return checkNullObj(row.worktime_list[week]) ? '' : row.worktime_list[week].up_work_title
        }
      }
    },
    // 列表
    get_list(num) {
      this.attendanForm.page = num || this.attendanForm.page
      const param = this.attendanForm
      // get_admin_worktime(param)
      //   .then(res => {
      //     this.tableData.data = res.data
      //   })
      //   .catch(err => {
      //     this.$message.error(err.data.data)
      //   })

    },
    // 本周--获取当前周的时间
    on_week(){
      this.date = this.$moment().weekday(0).format('yyyy-MM-DD')
      let begin_day = this.date
      let end_day = moment(this.date).add(6,'days').format('yyyy-MM-DD')
      let my_day = []
      my_day.push(begin_day)
      my_day.push(end_day)
      this.attendanForm.range = my_day.join('.')
      this.get_list()
    },
    // 上一周
    getLastWeek(){
      this.date = moment(this.date).subtract(7, 'days').format('yyyy-MM-DD')
      let begin_day = this.date
      let end_day = moment(this.date).add(6,'days').format('yyyy-MM-DD')
      let my_day = []
      my_day.push(begin_day)
      my_day.push(end_day)
      this.attendanForm.range = my_day.join('.')
      this.get_list()
    },
    // 下一周
    getNextWeek(){
      this.date = moment(this.date).add(7, 'days').format('yyyy-MM-DD')
      let begin_day = this.date
      let end_day = moment(this.date).add(6,'days').format('yyyy-MM-DD')
      let my_day = []
      my_day.push(begin_day)
      my_day.push(end_day)
      this.attendanForm.range = my_day.join('.')
      this.get_list()
    },
    // // 点击单元格时
    // cell_click(row, column, cell, event){
    //   let date = column.label.slice(0, 10)
    //   // 此单元格的日期与当天日期对比，若小于当天日期，则可以弹出弹框改变排班状态
    //   if(new Date(new Date(date).getTime()) < new Date){
    //     if(this.mer_flag == 1){
    //       this.status_visibile = true
    //     }
    //   }
    // },
    // 确定
    status_submit(){

    },
    // 考勤汇总相关
    // 下载
    download(){
      download_admin_work({mer_id:this.attenSumForm.mer_id,date:this.attenSumForm.date+'-01'})
        .then(res => {
          window.open(res.data, "_blank");
        })
        .catch(err => {
          this.$message.error(err.data.data)
        })
    },
    // 考勤列表
    get_sum_list(num) {
      this.attenSumForm.page = num || this.attenSumForm.page
      const param = this.attenSumForm
      get_admin_work_count({page:this.attenSumForm.page,limit:this.attenSumForm.limit,mer_id:this.attenSumForm.mer_id,date:this.attenSumForm.date+'-01'})
        .then(res => {
          this.sumTableData.data = res.data.items
          this.sumTableData.total = res.data.total
        })
        .catch(err => {
          this.$message.error(err.data.data)
        })
    },
    sum_page_change(page) {
      this.attenSumForm.page = page
      this.get_sum_list('')
    },
    sum_handle_size_change(val) {
      this.attenSumForm.limit = val
      this.get_sum_list('')
    },
  }
}
</script>

<style lang="scss">
::deep [type=reset],
[type=submit],
button,
html [type=button] {
    -webkit-appearance: none !important;
}
.attendance{
  .box-card {
    margin: 20px 20px
  }

  .container {
    min-width: 821px;
  }

  .block{
    float: right;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .table_top{
    display: flex;
    position: relative;
    align-items: center;
    height: 85px;
    background-color: #52575C;
    color: #FFFFFF;
    padding: 0 20px;
    .right{
      position: absolute;
      right: 20px;
    }
    .el-button--info {
      background-color: #42464A;
      border-color: #42464A;
    }
  }
  .el-table .cell{
    white-space:pre-line; // 换行
  }
  .cell_rt{
    position: absolute;
    top: 0;
    right: 0;
    float: right;
    background-color: #C7C7C7;
    color: #FFFFFF;
  }
}
.status_dialog{
  .el-dialog__body{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    .el-radio{
      margin-top: 10px;
      margin-bottom: 10px;
    }
  }
}
.el-radio.is-bordered + .el-radio.is-bordered{
  margin-left: 0;
}
</style>
