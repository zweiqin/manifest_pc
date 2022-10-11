<template>
  <div class="supplier">
    <el-card class="el-card">
      <div slot="header">
        <el-form :inline="true" :model="search_form" class="demo-form-inline" size="small">
          <el-form-item label="供应商名称">
            <el-input v-model="search_form.name_like" clearable placeholder="请输入供应商名称"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="search_form.status" placeholder="请选择状态" @change="search">
              <el-option
                v-for="item in status_options"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
          </el-form-item>
        </el-form>
        <!-- 新增供应商       -->
        <el-button size="small" type="primary" @click="add_supplier_visible = true">新增供应商</el-button>
      </div>
      <el-table :data="table_data.data">
        <el-table-column label="id" min-width="180" prop="id"></el-table-column>
        <el-table-column label="供应商名称" min-width="180" prop="name"></el-table-column>
        <el-table-column label="联系电话" min-width="180" prop="phone"></el-table-column>
        <el-table-column label="状态" min-width="180" prop="status">
          <template v-slot="scope">
            <el-tag v-if="scope.row.status === 1" type="success">正常</el-tag>
            <el-tag v-else-if="scope.row.status === 0" type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="180">
          <template v-slot="scope">
            <el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          :current-page="search_form.page"
          :page-size="search_form.limit"
          :page-sizes="[10, 20, 30, 40]"
          :total="table_data.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>

      <!--s 新增供应商窗口     -->
      <el-dialog :visible.sync="add_supplier_visible" title="新增供应商">
        <el-form
          ref="add_supplier_form"
          :model="add_supplier_form"
          :rules="add_supplier_form_rules"
          label-position="left"
          label-width="120px"
        >
          <el-form-item label="供应商名称" prop="name">
            <el-input v-model="add_supplier_form.name"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="add_supplier_form.phone"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="add_supplier_form.status" placeholder="请选择状态">
              <el-option
                v-for="item in status_options"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="add_supplier_visible = false">取 消</el-button>
          <el-button type="primary" @click="addSupplierSubmit">确 定</el-button>
        </span>
      </el-dialog>
      <!--e 新增供应商窗口     -->

      <!--s 编辑窗口 -->
      <el-dialog :visible.sync="edit_supplier_visible" title="编辑供应商" width="30%">
        <el-form
          ref="edit_supplier_form"
          :model="edit_supplier_form"
          :rules="edit_supplier_form_rules"
          label-position="left"
          label-width="120px"
        >
          <el-form-item label="供应商名称" prop="name">
            <el-input v-model="edit_supplier_form.name" placeholder="请输入供应商名称"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="edit_supplier_form.phone" placeholder="请输入联系电话"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="edit_supplier_form.status" placeholder="请选择状态">
              <el-option
                v-for="item in status_options"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="edit_supplier_visible = false">取 消</el-button>
          <el-button type="primary" @click="edit_submit">确 定</el-button>
        </span>
      </el-dialog>
      <!--e 编辑窗口 -->
    </el-card>
  </div>
</template>

<script>
import { GetSupplierList, OperateSupplier } from '@/api/admin'

export default {
  name: 'supplier',
  data() {
    return {
      search_form: {
        name_like: '',
        status: '',
        page: 1,
        limit: 10
      },
      status_options: [
        {
          id: 1,
          label: '启用'
        },
        {
          id: 0,
          label: '禁用'
        }
      ],
      table_data: {
        data: [
          {
            id: 1,
            name: '供应商1',
            phone: '12345678901',
            status: 1
          },
          {
            id: 2,
            name: '供应商2',
            phone: '12345678901',
            status: 2
          }
        ],
        total: 0
      },
      // s编辑供应商窗口
      edit_supplier_visible: false,
      edit_supplier_form: {
        id: '',
        phone: '',
        name: '',
        status: ''
      },
      edit_supplier_form_rules: {
        name: [
          { required: true, message: '请输入供应商名称', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      },
      // e编辑供应商窗口
      // s新增供应商窗口
      add_supplier_visible: false,
      add_supplier_form: {
        name: '',
        phone: '',
        status: ''
      },
      add_supplier_form_rules: {
        name: [
          { required: true, message: '请输入供应商名称', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      }
      // e新增供应商窗口
    }
  },
  created() {
    this.search()
  },
  methods: {
    search() {
      GetSupplierList(this.search_form)
        .then(res => {
          this.table_data.data = res.data.items
          this.table_data.total = res.data.total
        })
        .catch(err => {
          this.$message.error(err.msg)
        })
    },
    // 分页
    handleCurrentChange(val) {
      this.search_form.page = val
      this.search()
    },
    handleSizeChange(val) {
      this.search_form.limit = val
      this.search()
    },
    // 编辑供应商
    handleEdit(index, row) {
      this.edit_supplier_form.id = row.id
      this.edit_supplier_form.name = row.name
      this.edit_supplier_form.phone = row.phone
      this.edit_supplier_form.status = row.status
      this.edit_supplier_visible = true
    },
    handleDelete(index, row) {
      console.log(index, row)
    },
    // 确认新增供应商
    addSupplierSubmit() {
      this.$refs.add_supplier_form.validate((valid) => {
        if (valid) {
          OperateSupplier(this.add_supplier_form)
            .then(res => {
              this.$message.success('新增供应商成功')
              this.add_supplier_visible = false
              this.search()
            })
            .catch(err => {
              this.$message.error(err.msg)
            })
        } else {
          return false
        }
      })
    },

    // 确认编辑供应商
    edit_submit() {
      this.$refs.edit_supplier_form.validate((valid) => {
        if (valid) {
          OperateSupplier(this.edit_supplier_form)
            .then(res => {
              this.$message.success('编辑供应商成功')
              this.edit_supplier_visible = false
              this.search()
            })
            .catch(err => {
              this.$message.error(err.msg)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.supplier {
  .el-card {
    margin: 20px;

    .block {
      float: right;
      margin: 20px 0;
    }
  }
}
</style>
