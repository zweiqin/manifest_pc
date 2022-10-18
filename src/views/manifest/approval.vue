<template>
	<div class="goods">
		<el-card class="el-card">
			<!-- s搜索区 -->
			<div class="container">
				<el-form inline size="small" :label-position="'right'">

					<el-form-item label="货单类型">
						<el-select
							v-model="search_form.status"
							clearable
							placeholder="请选择货单类型"
							class="selWidth"
						>
							<el-option
								v-for="item in storeType_list"
								:key="item.status"
								:label="item.name"
								:value="item.status"
							/>
						</el-select>
					</el-form-item>

					<el-form-item label="创建时间">
						<el-date-picker
							v-model="range"
							type="daterange"
							range-separator="至"
							start-placeholder="开始时间"
							end-placeholder="结束时间"
							value-format="yyyy-MM-dd"
							@change="changeDate"
						>
						</el-date-picker>
					</el-form-item>

					<el-form-item label="货单ID：">
						<el-input v-model="search_form.id	" placeholder="请输入货单ID" style="width: 210px" clearable />
					</el-form-item>

					<el-button class="ResetSearch mr10" size="small" type="reset" @click="reset()">重置</el-button>
					<el-button type="primary" label="default" size="small" @click="getList()">查询</el-button>
				</el-form>
			</div>
			<!-- e搜索区 -->

			<!-- s表格 -->
			<el-table :data="tableData.data" style="width: 100%" size="small" highlight-current-row>

				<el-table-column prop="id" label="ID" min-width="100" />
				<el-table-column prop="status" label="货单状态" min-width="100">
					<template v-slot="scope">
						<el-tag v-if="scope.row.status===2" type="info">审核不通过</el-tag>
						<el-tag v-else-if="scope.row.status===7" type="success">提交审核</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="create_time" label="创建时间" min-width="150" />
				<el-table-column label="团队审核成员" min-width="100" prop="team_admin_info.real_name" />
				<el-table-column prop="team_examine_status" label="团队审核状态" min-width="100">
					<template v-slot="scope">
						<el-tag v-if="scope.row.team_examine_status===0" type="info">未审核</el-tag>
						<el-tag v-else-if="scope.row.team_examine_status===1" type="success">通过</el-tag>
						<el-tag v-else type="success">不通过</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="manager_examine_status" label="管理者审核状态" min-width="100">
					<template v-slot="scope">
						<el-tag v-if="scope.row.manager_examine_status===0" type="info">未审核</el-tag>
						<el-tag v-else-if="scope.row.team_examine_status===1" type="success">通过</el-tag>
						<el-tag v-else type="success">不通过</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="examine_remark" label="审核不通过描述" min-width="100" />

				<el-table-column label="操作" min-width="120" fixed="right" align="center">
					<template v-slot="scope">
						<el-button type="text" size="small" class="mr10" @click="edit(scope.row)">编辑</el-button>
					</template>
				</el-table-column>
			</el-table>

			<div class="block">
				<el-pagination
					:page-sizes="[10, 20, 40, 60, 80]" :page-size="search_form.limit" :current-page="search_form.page" layout="total, sizes, prev, pager, next, jumper"
					:total="tableData.total"
					@size-change="handle_size_change" @current-change="page_change"
				/>
			</div>
			<!-- e表格 -->
		</el-card>

		<!-- s编辑 -->
		<el-dialog title="确认通过审批" :close-on-click-modal="false" :visible.sync="edit_visible" class="edit" width="80%">
			<!--s货单表格部分 以商品为单位 不同订单同商品不合并   -->
			<div class="table">
				<el-table
					:data="manifest_list"
					:summary-method="getSummaries"
					border
					show-summary
					style="width: 100%;margin-top: 20px;margin-bottom: 50px;"
				>
					<el-table-column label="序号" min-width="80" prop="id"></el-table-column>
					<el-table-column label="供应商" min-width="180" prop="name"></el-table-column>
					<el-table-column label="货物名称" min-width="180" prop="store_name"></el-table-column>
					<el-table-column label="订单数量" min-width="100" prop="cart_num"></el-table-column>
					<el-table-column label="仓库数量" min-width="120" prop="store_num"></el-table-column>
					<el-table-column label="采购数量" min-width="100" prop="purchase_num"></el-table-column>
					<el-table-column label="采购价" min-width="100" prop="cost"></el-table-column>
					<el-table-column label="采购总价" min-width="180" prop="total_price"></el-table-column>
					<el-table-column label="货单id" min-width="180" prop="manifest_id"></el-table-column>
					<el-table-column label="创建时间" min-width="180" prop="create_time"></el-table-column>
					<el-table-column label="验收状态" min-width="180" prop="accept_status">
						<template v-slot="scope">
							<el-tag v-if="scope.row.status === 1" type="success">成功验收</el-tag>
							<el-tag v-else type="danger">还没有验收</el-tag>
						</template>
					</el-table-column>
				</el-table>
				<div class="foot-btn">
					<el-button v-if="is_member&&!team_examine_status" class="foot-btn-item" type="primary" @click="submitManifest(1)">审批通过</el-button>
					<el-button v-if="is_manager&&!manager_examine_status&&team_examine_status===1" class="foot-btn-item" type="primary" @click="submitManifest(1)">审批通过</el-button>
					<el-button v-if="is_member&&is_show_unpass&&!team_examine_status" type="danger" @click="displayRefuse(2)">审批不通过</el-button>
					<el-button v-if="is_manager&&is_show_unpass&&!manager_examine_status&&team_examine_status===1" type="danger" @click="displayRefuse(2)">审批不通过</el-button>
				</div>
			</div>
		</el-dialog>
		<!-- e编辑 -->

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
import { ChangeManifestStatus, GetManifestList } from '@/api/manifest'
import localStorage from '@/utils/localStorage'
import { GetTeamUserInfo } from '@/api/admin'

export default {
	name: 'goods',
	data() {
		return {
			is_show_unpass: true,
			search_form: {
				date: '',
				page: 1,
				status: '7',
				limit: 10,
				create_time_l: '',
				create_time_r: '',
				team_examine_status: '',
				manager_examine_status: ''
			},
			tableData: {
				data: [],
				total: 0
			},

			// 人员类型列表
			storeType_list: [
				{ status: '2', name: '审核不通过' },
				{ status: '7', name: '提交审核' }
			],

			range: ['', ''],

			edit_visible: false,

			manifest_list: [],

			refuse_rules: {
				remark: [
					{ required: true, message: '请输入备注', trigger: 'blur' }
				]
			},
			refuse_visible: false,
			refuse_form: {
				remark: ''
			},

			team_examine_status: '',
			manager_examine_status: '',

			is_manager: false, // (leo) : 是否是团队管理员
			is_member: false // (leo) : 是否是团队成员

		}
	},
	async created() {
		await this.hasPermission()
		this.getList(1)
	},
	methods: {
		// (leo)  判断是否有权限
		async hasPermission() {
			// (leo) : 判断是否是团队成员或是团队管理员
			const admin_id = String(localStorage.get('admin_info').admin_id)
			await GetTeamUserInfo({ id: 2 })
				.then((res) => {
					// 判断是否是团队成员
					if (res.data.id_list.includes(admin_id)) {
						this.is_member = true
					}
					// 判断是否是团队管理员
					if (res.data.manager_id === admin_id) {
						this.is_manager = true
					}
					if (this.is_member === false && this.is_manager === false) {
						this.$message.error('您没有权限访问该页面')
						this.$router.push({ path: '/welcome/index' })
					}
				})
				.catch((err) => {
					this.$message.error(err.data.msg)
				})
		},
		changeDate(e) {
			// console.log(e)
		},
		// 重置
		reset() {
			this.search_form = {
				date: '',
				page: 1,
				limit: 10,
				status: '7',
				create_time_l: '',
				create_time_r: 0
			}
			this.range = ['', '']
			this.getList()
		},

		// 列表
		getList(num) {
			if (this.is_member) {
				this.search_form.team_examine_status = 0
			} else {
				this.search_form.team_examine_status = 1
				this.search_form.manager_examine_status = 0
			}
			this.search_form.create_time_r = this.range[0]
			this.search_form.create_time_l = this.range[1]
			this.search_form.page = num || this.search_form.page
			GetManifestList(this.search_form)
				.then((res) => {
					this.tableData.data = res.data.items
					this.tableData.total = res.data.total
					if (this.search_form.status === '2') {
						this.is_show_unpass = false
					} else {
						this.is_show_unpass = true
					}
				})
				.catch((err) => {
					this.$message.error(err)
				})
		},

		page_change(page) {
			this.search_form.page = page
			this.getList()
		},

		handle_size_change(val) {
			this.search_form.limit = val
			this.getList()
		},

		// 编辑
		edit(e) {
			e.ProductList.forEach((item) => {
				item.total_price = item.purchase_num * item.cost
			})
			this.manifest_list = e.ProductList
			this.edit_visible = true
			this.team_examine_status = e.team_examine_status
			this.manager_examine_status = e.manager_examine_status
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
				// 注意采购的字段在接口对接时要修改
				if (column.property === 'total_price') {
					const values = data.map((item) => Number(item[column.property]))
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

		// 提交审批
		submitManifest(num) {
			this.$confirm(`确定要${num === 2 ? '不' : ''}通过审批吗？`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				ChangeManifestStatus({
					id: this.manifest_list[0].manifest_id,
					status: num,
					admin_id: localStorage.get('admin_info').admin_id,
					ExamineRemark: this.refuse_form.remark
				})
					.then(() => {
						this.$message({
							type: 'success',
							message: '操作成功!'
						})
						this.edit_visible = false
						this.refuse_visible = false
						this.manifest_list = []
						this.getList()
					})
					.catch((err) => {
						this.$message.error(err.data.data)
					})
			})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消提交'
					})
				})
		},
		// s审批不通过的备注
		// 打开审批不通过的备注框
		displayRefuse() {
			this.refuse_visible = true
			this.$nextTick(() => {
				this.$refs.refuse_form.resetFields()
			})
		},
		// 提交审批不通过的备注
		refuseManifest() {
			this.$refs.refuse_form.validate((valid) => {
				if (valid) {
					this.submitManifest(2)
				} else {
					return false
				}
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
      margin-bottom: 10px;
    }
  }

  .foot-btn {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .block {
    float: right;
    margin: 20px 0;
  }
}
</style>

