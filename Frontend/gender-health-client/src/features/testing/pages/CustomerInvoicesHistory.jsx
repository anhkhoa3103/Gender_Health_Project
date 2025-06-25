import React from 'react'
import PackageList from '../components/PaymentList'
import TestTypeTable from '../components/TestTypeTable'
import InvoiceList from '../components/InvoicesList'
import TestResultListCustomer from '../components/TestResultListCustomer'
import Header from '../../components/Header'
export default function CustomerPage() {
  return (
    <div>
      <Header />
      <div className="customer-invoices-history" style={{ margin: "200px" }}>
        <InvoiceList />
      </div>
    </div>
  )
}