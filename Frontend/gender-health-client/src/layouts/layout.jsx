import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Header from '../features/components/Header';
import LoginPromptModal from '../features/components/LoginPromptModal';

export default function Layout() {

    

    return (
        <div>
            <Header activePage="service" />
            <Outlet />
            
        </div>
    )
}
