<template>
  <div class="goods">
    <el-card class="el-card">
      <!-- s头部日期选择     -->
      <div slot="header" class="header">
        <el-date-picker
          v-model="date"
          placeholder="选择日期"
          type="date"
          value-format="yyyy-MM-dd"
          @change="getGoodsList"
        >
        </el-date-picker>
        <el-button class="header-btn" type="primary" @click="createManifest()">生成当天货单</el-button>
      </div>
      <!-- e头部日期选择     -->

      <!--s货单表格部分 以商品为单位 不同订单同商品不合并   -->
      <div v-for="(item,index) in manifest_list" :key="index" class="table">
        <el-table
          :data="item"
          :summary-method="getSummaries"
          border
          class="el-table"
          show-summary
          style="width: 100%;margin-top: 20px"
        >
          <el-table-column label="序号" min-width="80" prop="id"></el-table-column>
          <el-table-column label="供应商" min-width="180" prop="supplier_name"></el-table-column>
          <el-table-column label="货物名称" min-width="180" prop="good_name"></el-table-column>
          <el-table-column label="订单数量" min-width="100" prop="order_num"></el-table-column>
          <el-table-column label="仓库数量" min-width="120" prop="warehouse_num">
            <template v-slot="scope">
              <el-input
                v-model="scope.row.warehouse_num"
                style="width: 100px"
                @change="changeWarehouseNum(scope.row,index)"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="采购数量" min-width="100" prop="purchase_num"></el-table-column>
          <el-table-column label="采购价" min-width="100" prop="purchase_price"></el-table-column>
          <el-table-column label="采购总价" min-width="180" prop="total_price"></el-table-column>
          <el-table-column label="货单id" min-width="180" prop="manifest_id"></el-table-column>
          <el-table-column label="创建时间" min-width="180" prop="create_time"></el-table-column>
          <el-table-column label="货物状态" min-width="180" prop="status">
            <template v-slot="scope">
              <el-tag v-if="scope.row.status === 1" type="success">已提交</el-tag>
              <el-tag v-else type="danger">未提交</el-tag>
            </template>
          </el-table-column>
        </el-table>

        <!--      // TODO (leo) 2022/9/30 10:37: 生成货单按钮权限控制，仅在货单未提交时可以保存与提交-->
        <div class="foot-btn">
          <el-button class="foot-btn-item" type="primary" @click="submitManifest(index)">提交审批</el-button>
        </div>
      </div>

    </el-card>
  </div>

</template>

<script>
export default {
  name: 'goods',
  data() {
    return {
      date: '',
      manifest_list: [
        [
          {
            id: 1,
            supplier_name: '供应商1',
            good_name: '商品1',
            order_num: 100,
            warehouse_num: 100,
            purchase_num: 100,
            purchase_price: 100,
            total_price: 10000,
            manifest_id: 1,
            create_time: '2020-01-01',
            status: 1
          },
          {
            id: 2,
            supplier_name: '供应商1',
            good_name: '商品2',
            order_num: 100,
            warehouse_num: 100,
            purchase_num: 100,
            purchase_price: 100,
            total_price: 10000,
            manifest_id: 1,
            create_time: '2020-01-01',
            status: 1
          },
          {
            id: 3,
            supplier_name: '供应商2',
            good_name: '商品1',
            order_num: 100,
            warehouse_num: 100,
            purchase_num: 100,
            purchase_price: 100,
            total_price: 10000,
            manifest_id: 1,
            create_time: '2020-01-01',
            status: 1
          },
          {
            id: 4,
            supplier_name: '供应商2',
            good_name: '商品2',
            order_num: 100,
            warehouse_num: 100,
            purchase_num: 100,
            purchase_price: 100,
            total_price: 10000,
            manifest_id: 1,
            create_time: '2020-01-01',
            status: 1
          }
        ],
        [
          {
            id: 1,
            supplier_name: '供应商1',
            good_name: '商品1',
            order_num: 100,
            warehouse_num: 100,
            purchase_num: 100,
            purchase_price: 100,
            total_price: 10000,
            manifest_id: 1,
            create_time: '2020-01-01',
            status: 1
          },
          {
            id: 2,
            supplier_name: '供应商1',
            good_name: '商品2',
            order_num: 100,
            warehouse_num: 100,
            purchase_num: 100,
            purchase_price: 100,
            total_price: 10000,
            manifest_id: 1,
            create_time: '2020-01-01',
            status: 1
          },
          {
            id: 3,
            supplier_name: '供应商2',
            good_name: '商品1',
            order_num: 100,
            warehouse_num: 100,
            purchase_num: 100,
            purchase_price: 100,
            total_price: 10000,
            manifest_id: 1,
            create_time: '2020-01-01',
            status: 1
          },
          {
            id: 4,
            supplier_name: '供应商2',
            good_name: '商品2',
            order_num: 100,
            warehouse_num: 100,
            purchase_num: 100,
            purchase_price: 100,
            total_price: 10000,
            manifest_id: 1,
            create_time: '2020-01-01',
            status: 1
          }
        ]
      ]
    }
  },
  created() {

  },
  methods: {
    // 更改日期时获得当天货单列表（如果有的话）
    getGoodsList() {
      console.log(this.date)
    },
    // 生成货单
    createManifest() {
      this.$confirm('确定要生成货单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // eslint-disable-next-line no-warning-comments
        // TODO:生成货单时需要将采购数量和采购价相乘得到采购总价
        this.$message({
          type: 'success',
          message: '生成成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消生成'
        })
      })
    },
    // 合计采购总价
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        // eslint-disable-next-line no-warning-comments
        // TODO：注意采购的字段在接口对接时要修改
        if (column.property === 'total_price') {
          const values = data.map(item => Number(item[column.property]))
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            }
            return prev
          }, 0)
        }
      })
      return sums
    },
    // 修改仓库数量
    changeWarehouseNum(row, index) {
      this.manifest_list[index].forEach(item => {
        if (item.id === row.id) {
          item.warehouse_num = row.warehouse_num
          item.purchase_num = item.order_num - row.warehouse_num
          item.total_price = item.purchase_num * item.purchase_price
        }
      })
    },
    // 提交审批
    submitManifest(index) {
      this.$confirm('确定要提交审批吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '提交成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消提交'
        })
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.goods {
  .el-card {
    margin: 20px;

    .header {
      .header-btn {
        margin-left: 20px;
      }
    }

    .el-table {
      margin-bottom: 100px;
    }

    .foot-btn {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>

