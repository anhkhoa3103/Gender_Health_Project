import React from 'react'
import PackageList from '../testing/components/PackageList'
import TestTypeTable from '../testing/components/TestTypeTable'
import InvoiceList from '../testing/components/InvoicesList'
import InvoiceListStaff from '../testing/components/InvoicesListStaff'
import "../testing/styles/Invoices.css";
import Sidebar from '../components/sidebar'
import TestResultList from '../testing/components/TestResultList'
export default function staffResult() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <TestResultList />
    </div>
  )
}
