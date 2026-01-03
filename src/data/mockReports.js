export const mockReports = [
    {
        _id: 'report1',
        postId: '1',
        reason: 'Spam or misleading',
        additionalInfo: 'This appears to be a repeated post',
        reportedBy: 'user2',
        reportedAt: new Date('2024-12-11T14:30:00'),
        status: 'pending'
    },
    {
        _id: 'report2',
        postId: '3',
        reason: 'Inappropriate content',
        additionalInfo: 'Contains sensitive financial information without proper warning',
        reportedBy: 'user4',
        reportedAt: new Date('2024-12-10T09:15:00'),
        status: 'pending'
    },
    {
        _id: 'report3',
        postId: '5',
        reason: 'False information',
        additionalInfo: '',
        reportedBy: 'user3',
        reportedAt: new Date('2024-12-09T16:45:00'),
        status: 'pending'
    }
];
