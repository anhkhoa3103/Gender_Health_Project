import React from 'react'
import PackageList from '../components/PaymentList'
import TestTypeTable from '../components/TestTypeTable'
import InvoiceList from '../components/InvoicesList'
import TestResultListCustomer from '../components/TestResultListCustomer'

export default function CustomerPage() {
  return (
    <div>
        <TestResultListCustomer/>
       <InvoiceList/>
    </div>
  )
}
