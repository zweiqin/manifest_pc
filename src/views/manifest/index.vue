<template>
  <div class="manifest">
    <el-card class="el-card">
      <!--s头部搜索      -->
      <div slot="header">
        <el-form :label-position="labelPosition" inline size="small">
          <el-form-item label="日期">
            <el-date-picker
              v-model="search_form.date"
              end-placeholder="结束日期"
              range-separator="至"
              start-placeholder="开始日期"
              type="daterange"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="货单状态">
            <el-select v-model="search_form.status">
              <el-option
                v-for="item in status_options"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="货单号">
            <el-input v-model="search_form.manifest_no" placeholder="请输入货单号"></el-input>
          </el-form-item>
          <el-button size="mini" type="primary" @click="getManifestList">查找</el-button>
        </el-form>
      </div>
      <!--e头部搜索      -->

      <!--s货单表格      -->
      <el-table :data="table_data.data" class="el-table" stripe style="width: 100%">
        <el-table-column label="货单号" min-width="100" prop="manifest_no"></el-table-column>
        <el-table-column label="货单状态" min-width="100" prop="status">
          <template v-slot="scope">
            <el-tag v-if="scope.row.status === 1" type="primary">待审批</el-tag>
            <el-tag v-else-if="scope.row.status === 2" type="danger">待付款</el-tag>
            <el-tag v-else-if="scope.row.status === 3" type="warning">待验收</el-tag>
            <el-tag v-else-if="scope.row.status === 4" type="success">已完成</el-tag>
            <el-tag v-else-if="scope.row.status === 5" type="info">已退回</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="货单日志" min-width="300" prop="log">
          <template v-slot="scope">
            <div class="table-log">
              <div v-for="(item,index) in scope.row.log_list" :key="index" class="table-log-item">
                <div class="log-action">{{ item.log_action }}</div>
                <div class="log-time">{{ item.log_time }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="180" prop="create_time"></el-table-column>
        <el-table-column label="完成时间" min-width="180" prop="finish_time"></el-table-column>
        <!--        // TODO (Leo) 2022/9/30 11:35: 上传凭证按钮权限（待付款状态，且是财务部门才可显示）-->
        <el-table-column label="操作" min-width="180">
          <template v-slot="scope">
            <el-button
              size="mini"
              type="primary"
              @click="displayManifest(scope.row)"
            >查看货单
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="displayCertificate(scope.row)"
            >上传凭证
            </el-button>
          </template>
        </el-table-column>
        <!--e货单表格      -->
        <div class="block">
          <el-pagination
            :current-page="table_data.page"
            :page-size="table_data.limit"
            :page-sizes="[10, 20, 30, 40]"
            :total="table_data.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </div>
      </el-table>

    </el-card>

    <!--// TODO (Leo) 2022/9/30 11:57: 上传凭证与货单查看      -->
    <!-- s上传凭证     -->
    <el-dialog
      :visible.sync="upload_visible"
      title="上传凭证"
      width="80%"
    >
      <el-upload
        :auto-upload="false"
        :before-remove="beforeRemove"
        :file-list="file_list"
        :limit="1"
        :on-error="handleError"
        :on-exceed="handleExceed"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        action="https://jsonplaceholder.typicode.com/posts/"
        class="upload-demo"
      >
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
      <el-dialog
        :visible.sync="previewDialogVisible"
        width="30%"
      >
        <img :src="dialogImageUrl" alt="" width="100%">
      </el-dialog>
      <span slot="footer" class="dialog-footer">
        <el-button @click="upload_visible = false">取 消</el-button>
        <el-button type="primary" @click="uploadCerticificate">确 定</el-button>
      </span>
    </el-dialog>

    <!--s 查看货单    -->
    <el-dialog
      :visible.sync="manifest_visible"
      title="查看货单"
      width="80%"
    >
      <div class="manifest-dialog-main">
        <div
          v-for="(item,index) in manifest_list"
          :key="index"
          class="manifest-item"
        >
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
            <el-table-column label="仓库数量" min-width="120" prop="warehouse_num"></el-table-column>
            <el-table-column label="采购数量" min-width="100" prop="purchase_num"></el-table-column>
            <el-table-column label="采购价" min-width="100" prop="purchase_price"></el-table-column>
            <el-table-column label="采购总价" min-width="180" prop="total_price"></el-table-column>
            <el-table-column label="货单id" min-width="180" prop="manifest_id"></el-table-column>
            <el-table-column label="创建时间" min-width="180" prop="create_time"></el-table-column>
            <!--          // TODO (Leo) 2022/9/30 14:02: 货物状态需要与后端对接-->
            <el-table-column label="货物状态" min-width="180" prop="status">
              <template v-slot="scope">
                <el-tag v-if="scope.row.status === 1" type="success">已提交</el-tag>
                <el-tag v-else type="danger">未提交</el-tag>
              </template>
            </el-table-column>
          </el-table>
          <div class="manifest-item-btn">
            <el-button size="mini" type="primary">验收</el-button>
          </div>
        </div>
      </div>
      <div slot="footer" class="manifest-bottom-btn">
        <el-button size="small" type="primary">审批通过</el-button>
        <el-button size="small" type="danger" @click="displayRefuse()">审批不通过</el-button>
      </div>
    </el-dialog>
    <!--e 查看货单 -->

    <!--s 审批不通过的备注    -->
    <el-dialog
      :visible.sync="refuse_visible"
      title="审批不通过备注"
      width="50%"
    >
      <el-form ref="refuse_form" :model="refuse_form" :rules="refuse_rules" label-width="80px">
        <el-form-item label="备注" prop="remark">
          <el-input v-model="refuse_form.remark" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="refuse_visible = false">取 消</el-button>
        <el-button type="primary" @click="refuseManifest()">确 定</el-button>
      </div>
    </el-dialog>
    <!--e 审批不通过的备注    -->
  </div>
</template>

<script>
export default {
  name: 'index',
  data() {
    return {
      labelPosition: 'right',
      search_form: {
        date: '',
        status: '',
        manifest_no: '',
        page: 1,
        limit: 10
      },
      // 货单状态列表
      status_options: [
        {
          id: '',
          label: '全部'
        },
        {
          id: 1,
          label: '待审批'
        },
        {
          id: 2,
          label: '待付款'
        },
        {
          id: 3,
          label: '待验收'
        },
        {
          id: 4,
          label: '已完成'
        },
        {
          id: 5,
          label: '已退回'
        }
      ],
      // 货单表格数据
      table_data: {
        data: [
          {
            id: 1,
            manifest_no: '123456789',
            status: 1,
            log_list: [
              {
                log_action: '财务部门xxx进行了付款',
                log_time: '2020-01-01 12:00:00'
              },
              {
                log_action: '审批部门xxx进行了审批',
                log_time: '2020-01-01 12:00:00'
              },
              {
                log_action: '客服部门xxx拉取了货单',
                log_time: '2020-01-01 12:00:00'
              }
            ],
            create_time: '2020-01-01 12:00:00',
            finish_time: '2020-01-01 12:00:00'
          }
        ],
        total: 0
      },

      // s货单详细列表
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
          }
        ],
        [
          {
            id: 1,
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
            id: 2,
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
            id: 2,
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
      ],
      manifest_visible: false,
      // e货单详细列表

      // s上传凭证
      upload_visible: false,
      file_list: [],
      previewDialogVisible: false,
      dialogImageUrl: '', // 预览dialog图片的url
      // e上传凭证

      // s审批不通过的备注
      refuse_visible: false,
      refuse_form: {
        remark: ''
      },
      refuse_rules: {
        remark: [
          { required: true, message: '请输入备注', trigger: 'blur' }
        ]
      }
      // e审批不通过的备注
    }
  },
  created() {

  },
  methods: {
    // 获取货单列表数据
    getManifestList() {
      // GetManiFestList(this.search_form)
      //   .then(res => {
      //     this.table_data.data = res.data.items
      //     this.table_data.total = res.data.total
      //   })
      //   .catch(err => {
      //     this.$message.error(err.data.msg)
      //   })
    },
    handleSizeChange(val) {
      this.search_form.limit = val
      this.getManifestList()
    },
    handleCurrentChange(val) {
      this.search_form.page = val
      this.getManifestList()
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
    // 查看货单
    displayManifest(row) {
      this.manifest_visible = true
    },
    // s上传凭证
    // 打开上传凭证框
    displayCertificate(row) {
      this.upload_visible = true
    },
    // 上传凭证
    uploadCerticificate(row) {
      this.upload_visible = true
    },
    // 预览凭证
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.previewDialogVisible = true
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleSuccess(res, file) {
      console.log(res, file)
    },
    handleError(err, file) {
      console.log(err, file)
    },
    // e上传凭证

    // s审批不通过的备注
    // 打开审批不通过的备注框
    displayRefuse(row) {
      this.refuse_visible = true
      this.$nextTick(() => {
        this.$refs.refuse_form.resetFields()
      })
    },
    // 提交审批不通过的备注
    refuseManifest() {
      this.$refs.refuse_form.validate(valid => {
        if (valid) {
          this.$message.success('提交成功')
          this.refuse_visible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
    // e审批不通过的备注

  }
}
</script>

<style lang='scss' scoped>
/* 宽高分别对应纵向滚动条和横向滚动条的宽度 */
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
  background-color: #00000040;
}

::-webkit-scrollbar-thumb {
  background-color: #9a9a9a; /*rgba(0,0,0,1);*/
  border-radius: 10px;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}

.manifest {
  .el-card {
    margin: 20px;
  }

  .el-table {
    .table-log {
      height: 40px;
      overflow-y: auto;

      .table-log-item {
        display: flex;
        overflow-y: auto;

        .log-action {
          width: 50%;
          text-align: left;
        }

        .log-time {
          width: 50%;
          text-align: center;
        }
      }
    }
  }

  .manifest-dialog-main {
    height: 600px;
    overflow-y: auto;
  }

  .manifest-item {
    margin-bottom: 40px;

    .manifest-item-btn {
      margin-top: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .manifest-bottom-btn {
    //position: fixed;
    //bottom: 0;
    display: flex;
    justify-content: center;
  }
}
</style>
