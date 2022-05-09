<template>
  <!--员工分组（预留,基础版不需要,后续需要显示再添加到路由中）  -->
  <div class="group">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button type="primary" label="default" size="small" @click="add_click">新增员工分组</el-button>
      </div>

      <!-- s表格 -->
      <el-table :data="tableData.data" style="width: 100%" size="small" highlight-current-row>

        <el-table-column prop="sort" label="优先级排序" min-width="100" />

        <el-table-column prop="group_name" label="员工分组名称" min-width="100" />

<!--        <el-table-column prop="num" label="员工数目" min-width="100" />-->

        <el-table-column label="状态" min-width="100" >
          <template slot-scope="scope">
            <div style="cursor: pointer" v-if="scope.row.status == 1" @click="forbidden(scope.row,0)">
              <el-tag type="success" effect="dark" >启用</el-tag>
            </div>
            <div style="cursor: pointer" v-else @click="forbidden(scope.row,1)">
              <el-tag type="danger" effect="dark">禁用</el-tag>
            </div>
          </template>
        </el-table-column>

<!--        <el-table-column prop="is_show" label="是否在“技师”看板展示" min-width="150">-->
<!--          <template slot-scope="{row}">-->
<!--            <span>{{ row.is_show === 0 ? "不展示" : "展示" }}</span>-->
<!--          </template>-->
<!--        </el-table-column>-->

        <el-table-column label="操作" min-width="120" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" class="mr10" @click="edit(scope.row)">编辑</el-button>
            <el-button type="text" size="small" class="mr10" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="block">
        <el-pagination
          :page-sizes="[10, 20, 40, 60, 80]"
          :page-size="groupForm.limit"
          :current-page="groupForm.page"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.total"
          @size-change="handle_size_change"
          @current-change="page_change"
        />
      </div>
      <!-- e表格 -->
    </el-card>
    <!-- s新增 -->
    <el-dialog title="新增员工分组" :visible.sync="add_visible" class="add" width="30%" center>

      <el-form ref="addForm" :model="addForm" :rules="addRules">

        <el-form-item label="优先级排序：" :label-width="formLabelWidth" prop="sort">
          <el-input-number v-model="addForm.sort" :min="1" :controls="false" :step-strictly="true" placeholder="请输入优先级排序" />
        </el-form-item>

        <el-form-item label="分组名称：" :label-width="formLabelWidth" prop="group_name">
          <el-input v-model="addForm.group_name" autocomplete="off" placeholder="请输入分组名称" style="width: 198px"/>
        </el-form-item>

<!--        <el-form-item label="是否在“技师看板”展示：" label-width="formLabelWidth" prop="is_operator">-->
<!--          <el-radio-group v-model="addForm.is_operator">-->
<!--            <el-radio :label="1">展示</el-radio>-->
<!--            <el-radio :label="0">不展示</el-radio>-->
<!--          </el-radio-group>-->
<!--        </el-form-item>-->

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="add_submit('addForm')">保存</el-button>
      </div>
    </el-dialog>
    <!-- e新增 -->

    <!-- s禁用 -->
    <el-dialog :title="status == 0?'确认禁用':'确认启用'" :visible.sync="forbid_visible" class="forbid" width="30%" center>

      <span v-if="status == 0">禁用后分组将不可用,确认禁用该分组？</span>
      <span v-else>确认启用该分组？</span>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="forbid_submit('forbidForm')" size="small">{{status == 0 ? "确认禁用" : "确认启用"}}</el-button>
      </div>
    </el-dialog>
    <!-- e禁用 -->

    <!-- s编辑 -->
    <el-dialog title="编辑员工分组" :visible.sync="edit_visible" class="edit" width="30%" center>

      <el-form ref="editForm" :model="editForm" :rules="editRules">

        <el-form-item label="优先级排序：" :label-width="formLabelWidth" prop="sort">
          <el-input-number v-model="editForm.sort" :min="1" :controls="false" :step-strictly="true" placeholder="请输入优先级排序" />
        </el-form-item>

        <el-form-item label="分组名称：" :label-width="formLabelWidth" prop="group_name">
          <el-input v-model="editForm.group_name" autocomplete="off" placeholder="请输入分组名称" style="width: 198px"/>
        </el-form-item>

<!--        <el-form-item label="是否在“技师看板”展示：" label-width="formLabelWidth" prop="is_operator">-->
<!--          <el-radio-group v-model="editForm.is_operator">-->
<!--            <el-radio :label="1">展示</el-radio>-->
<!--            <el-radio :label="0">不展示</el-radio>-->
<!--          </el-radio-group>-->
<!--        </el-form-item>-->

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="edit_submit('editForm')">保存</el-button>
      </div>
    </el-dialog>
    <!-- e编辑 -->
  </div>
</template>

<script>

var reg_phone = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/

// import { group_search, group_update, group_create } from '@/api/user_group'

export default {
  name: 'group',
  data() {
    return {
      temp_data : {},
      status: 1,
      formLabelWidth: '120px',
      tableData: {
        data: [],
        total: 0
      },
      labelPosition: 'right',
      groupForm: {
        page: 1,
        limit: 10,
        status: '',
        is_del: 0,
        is_all: 0,
        is_user: 0
      },
      // 新增
      add_visible: false,
      addForm: {
        sort: '',
        group_name: '',
        is_user: 0,
      },
      addRules: {
        sort: [{ type: 'number', required: true, message: '优先级排序不能为空', change: 'blue' }],
        group_name: [{ required: true, message: '分组名称不能为空', change: 'blue' }]
      },
      // 禁用
      forbid_visible: false,
      // 编辑
      edit_visible: false,
      editForm: {},
      editRules: {
        sort: [{  type: 'number', required: true, message: '优先级排序不能为空', change: 'blue' }],
        group_name: [{ required: true, message: '分组名称不能为空', change: 'blue' }]
      }
    }
  },
  mounted() {
    this.get_list('')
  },
  methods: {
    add_click(){
      this.add_visible = true
      this.$nextTick(function () {
        this.$refs['addForm'].resetFields()
      })
    },
    group_search() {
      this.get_list(1)
    },
    // 列表
    get_list(num) {
      this.groupForm.page = num || this.groupForm.page
      const param = this.groupForm
      group_search(param)
        .then(res => {
          this.tableData.data = res.data.items
          this.tableData.total = res.data.total
        })
        .catch(err => {
          this.$message.error(err.data.data)
        })
    },
    page_change(page) {
      this.groupForm.page = page
      this.get_list('')
    },
    handle_size_change(val) {
      this.groupForm.limit = val
      this.get_list('')
    },
    // 禁用
    forbidden(e,status){
      console.log(e)
      this.temp_data = e
      this.status = status
      this.forbid_visible = true
    },
    // 禁用--确认
    forbid_submit(){
      let data = JSON.parse(JSON.stringify(this.temp_data))
      data.status = this.status
      group_update(data)
        .then(res => {
          this.$message.success('更改状态成功')
          this.get_list()
        })
        .catch(err => {
          this.$message.error(err.data.data)
        })
      this.forbid_visible = false

    },
    // 新增--确认
    add_submit(formName) {
      this.$refs[formName].validate(async valid => {
        // 若必填项不为空
        if (valid) {
          group_create(this.addForm)
            .then(res => {
              this.add_visible = false
              this.$message.success("新增成功")
              this.get_list('')
            })
            .catch(err => {
              this.$message.error(err.data.data)
            })
        } else {
          return false
        }
      })
    },
    // 编辑
    edit(e) {
      this.editForm = e
      this.edit_visible = true
    },
    // 编辑--确认
    edit_submit(formName) {
      this.$refs[formName].validate(async valid => {
        // 若必填项不为空
        if (valid) {
          group_update(this.editForm)
            .then(res => {
              this.$message.success("修改成功")
              this.edit_visible = false
              this.get_list('')
            })
            .catch(err => {
              this.$message.error(err.data.data)
            })
        } else {
          return false
        }
      })
    },
    // 删除
    del(row){
      let data = row
      data.is_del = 1
      this.$confirm('确定删除该组?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        group_update(data)
          .then(res=>{
            this.$message.success('删除组成功！')
            this.get_list()
          })
      }).catch(() => {});
    }
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
.group{
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
  .el-input__inner{
    text-align: left;
  }
  // 对话框内容居中
  .el-dialog__body{
    display: flex;
    justify-content: center;
  }
  .el-dialog__header{
    background-color: #F8F8F8;
    border-bottom: 1px solid #E5E5E5;
  }
  .el-dialog__footer{
    border-top: 1px solid #E5E5E5;
  }
}

</style>
