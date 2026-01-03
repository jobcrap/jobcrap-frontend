import React from 'react';
import AdminDataTable from '../AdminDataTable';

export default function UsersTab({ users, type, onAction, onNavigate, isLoading }) {
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
