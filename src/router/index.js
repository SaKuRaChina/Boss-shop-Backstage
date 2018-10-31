import Vue from 'vue'
import Router from 'vue-router'
import Log from '@/components/login'
import Index from '@/components/enter/index'
import Account from '@/components/account/index'
import Finance from '@/components/finance/info'
import Charge from '@/components/enter/charge'


import PocketIndex from '@/components/enter/pocket/index'
import PocketData from '@/components/enter/pocket/data'
import PocketPocketOrder from '@/components/enter/pocket/pocketOrder'
import PocketPocketTemplate from '@/components/enter/pocket/pocketTemplate'


import ProgramIndex from '@/components/enter/program/index'
import ProgramData from '@/components/enter/program/data'
import ChanceCenter from '@/components/enter/program/chanceCenter'
import ChanceInfo from '@/components/enter/program/chanceInfo'
import ChanceBanner from '@/components/enter/program/chanceBanner'
import ChanceVideo from '@/components/enter/program/chanceVideo'
import ChanceIntro from '@/components/enter/program/chanceIntro'
import ChanceExample from '@/components/enter/program/chanceExample'
import ProgramAsk from '@/components/enter/program/programAsk'
import PocketOrder from '@/components/enter/program/pocketOrder'
import PocketTemplate from '@/components/enter/program/pocketTemplate'
import ChargeManage from '@/components/enter/program/chargeManage'




import ProductIndex from '@/components/enter/product/index'
import ProductData from '@/components/enter/product/data'
import ProductChanceCenter from '@/components/enter/product/chanceCenter'
import ProductChanceInfo from '@/components/enter/product/chanceInfo'
import ProductChanceBanner from '@/components/enter/product/chanceBanner'
import ProductChanceVideo from '@/components/enter/product/chanceVideo'
import ProductChanceIntro from '@/components/enter/product/chanceIntro'
import ProductChanceExample from '@/components/enter/product/chanceExample'
import ProductProgramAsk from '@/components/enter/product/programAsk'
import ProductPocketOrder from '@/components/enter/product/pocketOrder'
import ProductPocketTemplate from '@/components/enter/product/pocketTemplate'
import ProductChargeManage from '@/components/enter/product/chargeManage'




import BossIndex from '@/components/enter/boss/index'
import BossHeadlineList from '@/components/enter/boss/headlineList'
import BossChargeManage from '@/components/enter/boss/chargeManage'


import FinanceInfo from '@/components/finance/financeInfo'
import Payfor from '@/components/finance/payfor'
import PayRecord from '@/components/finance/payRecord'
import ReceiptRecord from '@/components/finance/receiptRecord'
import ReceiptRight from '@/components/finance/receiptRight'
import SupplyReceipt from '@/components/finance/supplyReceipt'


import AccountInfo from '@/components/account/accountInfo'
import AccountSecurity from '@/components/account/accountSecurity'
import CompanyBase from '@/components/account/companyBase'
import CompanyService from '@/components/account/companyService'
import CompanyHonor from '@/components/account/companyHonor'
import CompanyMember from '@/components/account/companyMember'



Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Log',
      component: Log
    },
    {
    	path:'/index',
    	name:'index',
    	component:Index
    },
    {
    	path:'/finance',
    	component:Finance,
    	children:[
    		{
    			path:'/',
    			component:FinanceInfo
    		},
    		{
    			path:'/financeInfo',
    			component:FinanceInfo
    		},
    		{
    			path:'/payfor',
    			component:Payfor
    		},
    		{
    			path:'/payRecord',
    			component:PayRecord
    		},
    		{
    			path:'/receiptRecord',
    			component:ReceiptRecord
    		},
    		{
    			path:'/receiptRight',
    			component:ReceiptRight
    		},
    		{
    			path:'/supplyReceipt',
    			component:SupplyReceipt
    		}
    	]
    },
    {
    	path:'/account',
    	component:Account,
        children:[
            {
                path:'/',
                component:AccountInfo
            },
            {
                path:'/account/accountInfo',
                component:AccountInfo
            },
            {
                path:'/account/accountSecurity',
                component:AccountSecurity
            },
            {
                path:'/account/companyBase',
                component:CompanyBase
            },
            {
                path:'/account/companyService',
                component:CompanyService
            },
            {
                path:'/account/companyHonor',
                component:CompanyHonor
            },
            {
                path:'/account/companyMember',
                component:CompanyMember
            }
        ]
    },
    {
        path:'/charge',
        name:'charge',
        component:Charge
    },
    {
        path:'/pocket',
        component:PocketIndex,
        children:[
            {
                path:'/',
                component:PocketData
            },
            {
                path:'/pocket/pocketData',
                component:PocketData
            }, 
            {
                path:'/pocket/pocketOrder',
                component:PocketPocketOrder
            },
            {
                path:'/pocket/pocketTemplate',
                component:PocketPocketTemplate
            }
        ]
    },
    {
        path:'/program',
        component:ProgramIndex,
        children:[
            {
                path:'/',
                component:ProgramData
            },
            {
                path:'/program/programData',
                component:ProgramData
            },
            {
                path:'/program/chanceCenter',
                component:ChanceCenter
            },
            {
                path:'/program/chanceInfo',
                component:ChanceInfo
            },
            {
                path:'/program/chanceBanner',
                component:ChanceBanner
            },
            {
                path:'/program/chanceVideo',
                component:ChanceVideo
            },
            {
                path:'/program/chanceIntro',
                component:ChanceIntro
            },
            {
                path:'/program/chanceExample',
                component:ChanceExample
            },
            {
                path:'/program/programAsk',
                component:ProgramAsk
            },
            {
                path:'/program/pocketOrder',
                component:PocketOrder
            },
            {
                path:'/program/pocketTemplate',
                component:PocketTemplate
            },
            {
                path:'/program/chargeManage',
                component:ChargeManage
            }
        ]
    },
    {
        path:'/product',
        component:ProductIndex,
        children:[
            {
                path:'/',
                component:ProductData
            },
            {
                path:'/product/productData',
                component:ProductData
            },
            {
                path:'/product/chanceCenter',
                component:ProductChanceCenter
            },
            {
                path:'/product/chanceInfo',
                component:ProductChanceInfo
            },
            {
                path:'/product/chanceBanner',
                component:ProductChanceBanner
            },
            {
                path:'/product/chanceVideo',
                component:ProductChanceVideo
            },
            {
                path:'/product/chanceIntro',
                component:ProductChanceIntro
            },
            {
                path:'/product/chanceExample',
                component:ProductChanceExample
            },
            {
                path:'/product/productAsk',
                component:ProductProgramAsk
            },
            {
                path:'/product/pocketOrder',
                component:ProductPocketOrder
            },
            {
                path:'/product/pocketTemplate',
                component:ProductPocketTemplate
            },
            {
                path:'/product/chargeManage',
                component:ProductChargeManage
            }
        ]
    },
    {
        path:'/boss',
        component:BossIndex,
        children:[
            {
                path:'/',
                component:BossHeadlineList
            },
            {
                path:'/boss/headlineList',
                component:BossHeadlineList
            },
            {
                path:'/boss/chargeManage',
                component:BossChargeManage
            }
        ]
    }
  ]
})
