import React from 'react'
import PackageList from '../components/PackageList'
import TestTypeTable from '../components/TestTypeTable'
import InvoiceList from '../components/InvoicesList'
import Header from '../../components/Header'

export default function Packages() {
  return (
    <div>
      <div className="header_section" style={{ margin: "150px" }}>
        <Header />
      </div>
        <PackageList />
    </div>
  )
}
