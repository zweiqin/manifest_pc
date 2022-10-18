<template>
	<div class="manifest">
		<el-card class="el-card">
			<!--s头部搜索      -->
			<div slot="header">
				<el-form :label-position="'right'" inline size="small">
					<el-form-item label="采购单号">
						<el-input v-model="search_form.search_no" placeholder="请输入采购单号"></el-input>
					</el-form-item>
					<el-form-item label="供应商">
						<el-select v-model="search_form.supplier_id">
							<el-option
								v-for="item in supplier_options"
								:key="item.id"
								:label="item.name"
								:value="item.id"
							>
							</el-option>
						</el-select>
					</el-form-item>
					<!--					<el-form-item label="团体验收状态">-->
					<!--						<el-select v-model="search_form.team_accept_status">-->
					<!--							<el-option label="未验收" value="0"></el-option>-->
					<!--							<el-option label="已验收" value="1"></el-option>-->
					<!--						</el-select>-->
					<!--					</el-form-item>-->
					<!--					<el-form-item label="管理员验收状态">-->
					<!--						<el-select v-model="search_form.ManagerAcceptStatus">-->
					<!--							<el-option label="未验收" value="0"></el-option>-->
					<!--							<el-option label="已验收" value="1"></el-option>-->
					<!--						</el-select>-->
					<!--					</el-form-item>-->
					<el-button size="mini" type="primary" @click="getList()">查找</el-button>
				</el-form>
				<el-button type="danger" :disabled="disabled" size="small" @click="accept()">验收</el-button>
			</div>
			<!--e头部搜索      -->

			<!--s货单表格      -->

			<div
				v-for="(item,index) in table_data.data"
				:key="index"
				class="manifest-item"
			>
				<el-table
					:data="item.purchase_list"
					border
					class="el-table"
					style="width: 100%;margin-top: 20px"
					@selection-change="handleSelectionChange(index,$event)"
				>
					<el-table-column type="selection" width="55">
					</el-table-column>
					<el-table-column label="序号" min-width="80" prop="id"></el-table-column>
					<el-table-column label="供应商" min-width="180">{{ item.name }}</el-table-column>
					<el-table-column label="采购单号" min-width="180" prop="order_sn"></el-table-column>
					<el-table-column label="货物名称" min-width="180" prop="store_name"></el-table-column>
					<!--						<el-table-column label="订单数量" min-width="100" prop="cart_num"></el-table-column>-->
					<!--						<el-table-column label="仓库数量" min-width="120" prop="store_num"></el-table-column>-->
					<el-table-column label="采购数量" min-width="100" prop="num"></el-table-column>
					<!--					<el-table-column label="货单id" min-width="180" prop="manifest_id"></el-table-column>-->
					<!--						<el-table-column label="创建时间" min-width="180" prop="create_time"></el-table-column>-->
					<!--         货物状态需要与后端对接-->
					<el-table-column label="团队验收状态" min-width="180" prop="team_pay_status">
						<template v-slot="scope">
							<el-tag v-if="scope.row.team_accept_status === '1'" type="success">已验收</el-tag>
							<el-tag v-else type="danger">待验收</el-tag>
							<!--                <el-tag v-if="scope.row.team_accept_status === '1'&&scope.row.manager_accept_status === '1'" type="success">已验收</el-tag>-->
							<!--                <el-tag v-else-if="scope.row.team_pay_status === '1'&&scope.row.manager_pay_status === '1'" type="danger">待验收</el-tag>-->
							<!--                <el-tag v-else type="danger">待批款</el-tag>-->
						</template>
					</el-table-column>
					<el-table-column label="管理员验收状态" min-width="180" prop="manager_accept_status">
						<template v-slot="scope">
							<el-tag v-if="scope.row.manager_accept_status === '1'" type="success">已验收</el-tag>
							<el-tag v-else type="danger">待验收</el-tag>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="block" style="margin-top: 20px">
				<el-pagination
					:current-page="search_form.page"
					:page-size="search_form.limit"
					:page-sizes="[5, 10, 15, 20]"
					:total="table_data.total"
					layout="total, sizes, prev, pager, next, jumper"
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
				>
				</el-pagination>
			</div>

		</el-card>

	</div>
</template>

<script>
import { AcceptPurchase, GetAcceptList, GetSupplierList } from '@/api/manifest'
import localStorage from '@/utils/localStorage'
import { GetTeamUserInfo } from '@/api/admin'

export default {
	name: 'acceptance.vue',
	data() {
		return {
			search_form: {
				search_no: '',
				supplier_id: '',
				team_accept_status: '1',
				ManagerAcceptStatus: '1',
				page: 1,
				limit: 5
			},
			table_data: {
				data: [],
				total: 0
			},
			multipleSelection: [],
			supplier_options: [],
			disabled: true,

			is_manager: false, // (leo) : 是否是团队管理员
			is_member: false // (leo) : 是否是团队成员
		}
	},
	// computed: {
	// 	disabled() {
	// 		return this.multipleSelection.length === 0
	// 	}
	// },
	// watch: {
	// 	multipleSelection: {
	// 		disabled(newVal, oldVal) {
	// 		},
	// 		immediate: false,  // 是否在obj创建后立即执行
	// 		deep: true     // deep意为深度检测
	// 	}
	// },
	async created() {
		await this.hasPermission()
		this.getList()
		this.getsupplier()
	},
	methods: {
		// (leo)  判断是否有权限
		async hasPermission() {
			// (leo) : 判断是否是团队成员或是团队管理员
			const admin_id = String(localStorage.get('admin_info').admin_id)
			await GetTeamUserInfo({ id: 4 })
				.then((res) => {
					// 判断是否是团队成员
					if (res.data.id_list.includes(admin_id)) {
						this.is_member = true
						console.warn('团队成员')
					}
					// 判断是否是团队管理员
					if (res.data.manager_id === admin_id) {
						this.is_manager = true
						console.warn('管理员')
					}
					if (this.is_member === false && this.is_manager === false) {
						this.$message.error('您没有权限访问该页面')
						this.$router.push({ path: '/welcome/index' })
					}
					if (this.is_member) {
						this.search_form.team_accept_status = '0'
						this.search_form.ManagerAcceptStatus = ''
					} else {
						this.search_form.team_accept_status = '1'
						this.search_form.ManagerAcceptStatus = '0'
					}
				})
				.catch((err) => {
					this.$message.error(err.data.msg)
				})
		},
		// 获取货单列表数据 // 列表
		getList(num) {
			this.search_form.page = num || this.search_form.page
			GetAcceptList(this.search_form)
				.then((res) => {
					console.log(res)
					this.table_data.data = res.data.items
					this.table_data.total = res.data.total
				})
				.catch((err) => {
					this.$message.error(err)
				})
		},
		getsupplier() {
			GetSupplierList({})
				.then((res) => {
					console.log(res)
					this.supplier_options = res.data.items
				})
				.catch((err) => {
					this.$message.error(err)
				})
		},
		handleSizeChange(val) {
			this.search_form.limit = val
			this.getList()
		},
		handleCurrentChange(val) {
			this.search_form.page = val
			this.getList()
		},
		handleSelectionChange(index, val) {
			this.multipleSelection[index] = val
			console.log(index, this.multipleSelection)
			this.disabled = !this.multipleSelection.some((item) => item.length)
		},

		accept() {
			const temp_arr = []
			this.multipleSelection.forEach((item) => {
				// console.log(item)
				item.forEach((item) => {
					temp_arr.push(item.id)
				})
			})
			// console.log(temp_arr.join(','))
			AcceptPurchase({ id_list: temp_arr.join(','), status: 1, admin_id: localStorage.get('admin_info').admin_id })
				.then((res) => {
					// console.log(res)
					this.$message({
						type: 'success',
						message: '操作成功!'
					})
					this.getList()
				})
				.catch((err) => {
					this.$message.error(err)
				})
		}

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
  .block {
    float: right;
    margin: 20px 0;
  }
}
</style>
