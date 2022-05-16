<template>
  <div class="state">
    <el-card class="box-card">
      <div class="clearfix">
        <!-- s搜索区 -->
        <div class="container">
          <el-button type="primary" label="default" size="small" @click="open_dialog('add')"> 添加员工状态</el-button>
        </div>
        <!-- e搜索区 -->
      </div>

      <!-- s表格 -->
      <el-table :data="tableData.data" style="width: 100%" size="small" highlight-current-row>

        <el-table-column prop="id" label="ID" min-width="100" />
        
        <el-table-column prop="name" label="员工状态" min-width="100" />

        <el-table-column  label="操作" min-width="100" >
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="open_dialog('edit',scope.row)">编辑</el-button>
            <el-button type="text" size="mini" style="color:red" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
          
      </el-table>
      <!-- e表格 -->
    </el-card>

    <!-- s添加/编辑员工状态 -->
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="700px"
      v-if="dialogVisible"
    >
      <el-form ref="form" :model="form" label-width="80px" :rules="formRules" @submit.native.prevent> 
        <el-form-item label="员工状态" prop="name">
          <el-input placeholder="请填写员工状态" v-model="form.name" @keyup.enter.native="submit()"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="submit()">确认提交</el-button>
      </div>
    </el-dialog>
    <!-- e添加/编辑员工状态 -->
  </div>
</template>

<script>
import localstorage from '@/utils/localStorage';
import { get_state,add_state,del_state  } from '@/api/admin';
export default {
  name: 'state',
  data() {
    return {
      formLabelWidth: '120px',
      tableData: {
        data: [],
        total: 0
      },
      labelPosition: 'right',
      dialogVisible: false,
      
      //注：总后台：admin_type:0,mer_id:0    商户端：admin_type:2,mer_id:localstorage.get('admin_info').mer_id
      form: {
        name: '',
        admin_type: 0,
        mer_id: 0
      },
      formRules: {
        name: [
          { required: true, message: '请输入员工状态', trigger: 'blur' },
        ],
      },
      title: '新增员工状态',
    }
  },
  mounted() {
    this.get_list()
  },
  methods: {
		//员工状态列表
    get_list() {
      //注：总后台：admin_type:0,mer_id:0    商户端：admin_type:2,mer_id:localstorage.get('admin_info').mer_id
      get_state({amdin_type:0,mer_id:0})
      .then(res => {
        if (res.status === 200) {
          this.tableData.data = res.data
        }
      }).catch(err => {
        this.$message.error(err.data.data)
      })
    },
		//打开添加/修改对话框 
    open_dialog(state,e) {
      if(state == 'add') {
        this.title = '新增员工状态'
      }else {
        this.title = '编辑员工状态'
        this.form = JSON.parse(JSON.stringify(e))
      }
      this.dialogVisible = true
    },
    //添加/修改员工状态
    submit() {
      add_state(this.form)
        .then(res => {
          if(this.form.hasOwnProperty('id')) {
            this.$message.success('修改员工状态成功！')
          }else {
            this.$message.success('新增员工状态成功！')
          }
          this.dialogVisible = false
          this.form = {
            name: ''
          }
          this.get_list()
        }).catch(err => {
          this.$message.error(err.data.data)
        })
    },
    //删除员工状态
    del(e) {
      this.$confirm('确认删除员工状态?', '', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          del_state(e.id)
            .then(res => {
              this.$message.success('删除成功')
              this.get_list()
            })
            .catch(err => {
              this.$message.error(err.data.data)
            })
        })
        .catch(err => { console.error(err) })
    }
  },
}
</script>

<style lang="scss" scoped>
::deep [type=reset],
[type=submit],
button,
html [type=button] {
    -webkit-appearance: none !important;
}
.state {

}
</style>