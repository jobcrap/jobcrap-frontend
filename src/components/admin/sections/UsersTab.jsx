import React from 'react';
import AdminDataTable from '../AdminDataTable';

export default function UsersTab({ users, onAction, onNavigate, isLoading }) {
    return (
        <AdminDataTable
            type="users"
            data={users}
            onAction={onAction}
            onNavigate={onNavigate}
            isLoading={isLoading}
        />
    );
}
