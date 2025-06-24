import React from 'react'
import PackageList from '../testing/components/PaymentList'
import TestTypeTable from '../testing/components/TestTypeTable'
import InvoiceList from '../testing/components/InvoicesList'
import InvoiceListStaff from '../testing/components/InvoicesListStaff'
import "../testing/styles/Invoices.css";
import Sidebar from '../components/sidebar'
import AppointmentList from '../testing/components/AppointmentList'
export default function StaffAppointmentManagement() {
  return (
    <div style={{ display: "flex" }}>
        <Sidebar />
        <AppointmentList />
        
    </div>
  )
}
