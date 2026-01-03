export const mockUsers = [
    {
        _id: 'user1',
        email: 'admin@workstories.com',
        role: 'admin',
        createdAt: new Date('2024-01-15'),
        blocked: false
    },
    {
        _id: 'user2',
        email: 'user@example.com',
        role: 'user',
        createdAt: new Date('2024-02-20'),
        blocked: false
    },
    {
        _id: 'user3',
        email: 'spammer@example.com',
        role: 'user',
        createdAt: new Date('2024-03-10'),
        blocked: true
    },
    {
        _id: 'user4',
        email: 'troll@example.com',
        role: 'user',
        createdAt: new Date('2024-04-05'),
        blocked: true
    }
];

export const mockPosts = [
    {
        _id: '1',
        userId: 'user1',
        profession: 'Software Engineer',
        country: 'United States',
        category: 'funny',
        text: 'My manager asked me to "make the logo bigger" for the 5th time today. So I made it so big it covered the entire screen. He loved it. Now I have to make it smaller again. My manager asked me to "make the logo bigger" for the 5th time today. So I made it so big it covered the entire screen. He loved it. Now I have to make it smaller again. My manager asked me to "make the logo bigger" for the 5th time today. So I made it so big it covered the entire screen. He loved it. Now I have to make it smaller again. My manager asked me to "make the logo bigger" for the 5th time today. So I made it so big it covered the entire screen. He loved it. Now I have to make it smaller again. My manager asked me to "make the logo bigger" for the 5th time today. So I made it so big it covered the entire screen. He loved it. Now I have to make it smaller again. My manager asked me to "make the logo bigger" for the 5th time today. So I made it so big it covered the entire screen. He loved it. Now I have to make it smaller again. My manager asked me to "make the logo bigger" for the 5th time today. So I made it so big it covered the entire screen. He loved it. Now I have to make it smaller again. My manager asked me to "make the logo bigger" for the 5th time today. So I made it so big it covered the entire screen. He loved it. Now I have to make it smaller again. My manager asked me to "make the logo bigger" for the 5th time today. So I made it so big it covered the entire screen. He loved it. Now I have to make it smaller again. My manager asked me to "make the logo bigger" for the 5th time today. So I made it so big it covered the entire screen. He loved it. Now I have to make it smaller again. My manager asked me to "make the logo bigger" for the 5th time today. So I made it so big it covered the entire screen. He loved it. Now I have to make it smaller again. My manager asked me to "make the logo bigger" for the 5th time today. So I made it so big it covered the entire screen. He loved it. Now I have to make it smaller again.',
        triggerWarnings: [],
        upvotes: 245,
        downvotes: 12,
        commentsCount: 34,
        createdAt: new Date('2024-12-10T14:30:00'),
        originalLanguage: 'en',
        status: 'approved',
        translations: {
            'es': 'Mi gerente me pidió que "hiciera el logo más grande" por quinta vez hoy. Así que lo hice tan grande que cubría toda la pantalla. Le encantó. Ahora tengo que hacerlo más pequeño otra vez.',
            'fr': 'Mon manager m\'a demandé de "agrandir le logo" pour la 5ème fois aujourd\'hui. Je l\'ai donc fait si grand qu\'il couvrait tout l\'écran. Il a adoré. Maintenant je dois le réduire à nouveau.'
        }
    },
    {
        _id: '2',
        userId: 'user2',
        profession: 'Nurse',
        country: 'Canada',
        category: 'wholesome',
        text: 'A patient who was terrified of needles squeezed my hand so hard during an IV insertion. Afterwards, she apologized profusely. I told her she could squeeze as hard as needed - that\'s what I\'m here for. She cried happy tears.',
        triggerWarnings: [],
        upvotes: 892,
        downvotes: 8,
        commentsCount: 67,
        createdAt: new Date('2024-12-09T10:15:00'),
        originalLanguage: 'en',
        status: 'approved',
        translations: {}
    },
    {
        _id: '3',
        userId: 'user1',
        profession: 'Teacher',
        country: 'United Kingdom',
        category: 'sad',
        text: 'Had to explain to my class why their favorite student wouldn\'t be coming back. His family couldn\'t afford to stay in the area. The kids pooled their lunch money to try to help. Broke my heart.',
        triggerWarnings: ['Financial Hardship'],
        upvotes: 456,
        downvotes: 23,
        commentsCount: 89,
        createdAt: new Date('2024-12-08T16:45:00'),
        originalLanguage: 'en',
        status: 'approved',
        translations: {}
    },
    {
        _id: '4',
        userId: 'user2',
        profession: 'Retail Manager',
        country: 'Australia',
        category: 'quirky',
        text: 'Customer insisted we had a "secret menu" like fast food places. I made one up on the spot. Now corporate wants to know where I got it from because customers keep asking for it.',
        triggerWarnings: [],
        upvotes: 678,
        downvotes: 45,
        commentsCount: 123,
        createdAt: new Date('2024-12-07T09:20:00'),
        originalLanguage: 'en',
        status: 'approved',
        translations: {}
    },
    {
        _id: '5',
        userId: 'user1',
        profession: 'Chef',
        country: 'France',
        category: 'absurd',
        text: 'A customer sent back their steak five times asking for it "more rare." On the fifth attempt, I literally just waved it over the grill for 2 seconds. They said it was perfect.',
        triggerWarnings: [],
        upvotes: 1034,
        downvotes: 67,
        commentsCount: 156,
        createdAt: new Date('2024-12-06T19:00:00'),
        originalLanguage: 'en',
        status: 'approved',
        translations: {}
    },
    {
        _id: '6',
        userId: 'user2',
        profession: 'Firefighter',
        country: 'Germany',
        category: 'Wholesome',
        text: 'Saved a family of four from a house fire. The father found me at the station weeks later to thank me. He said I gave his kids their future back. I don\'t think I\'ll ever forget that moment.',
        triggerWarnings: [],
        upvotes: 2341,
        downvotes: 12,
        commentsCount: 234,
        createdAt: new Date('2024-12-05T12:30:00'),
        originalLanguage: 'en',
        status: 'approved',
        translations: {}
    },
    {
        _id: '7',
        userId: 'user2',
        profession: 'HR Manager',
        country: 'United States',
        category: 'funny',
        text: 'Employee requested a "mental health day" but I saw photos of them at a theme park on Instagram. When confronted, they said riding roller coasters IS their therapy. Fair enough.',
        triggerWarnings: [],
        upvotes: 0,
        downvotes: 0,
        commentsCount: 0,
        createdAt: new Date('2024-12-12T08:00:00'),
        originalLanguage: 'en',
        status: 'pending',
        translations: {}
    },
    {
        _id: '8',
        userId: 'user3',
        profession: 'Content Moderator',
        country: 'India',
        category: 'sad',
        text: 'I review thousands of disturbing posts every day. Today I saw something that really got to me. Had to step away for 20 minutes. Nobody asks how we\'re doing after seeing all this.',
        triggerWarnings: ['Mental Health', 'Trauma'],
        upvotes: 0,
        downvotes: 0,
        commentsCount: 0,
        createdAt: new Date('2024-12-12T09:30:00'),
        originalLanguage: 'en',
        status: 'pending',
        translations: {}
    },
    {
        _id: '9',
        userId: 'user2',
        profession: 'Delivery Driver',
        country: 'United Kingdom',
        category: 'Wholesome',
        text: 'Regular customer always tips $20. Today I found out she\'s a hospice nurse who works double shifts. She says I make her day better by being friendly. Now I always leave a note.',
        triggerWarnings: [],
        upvotes: 30,
        downvotes: 10,
        commentsCount: 0,
        createdAt: new Date('2024-12-12T11:00:00'),
        originalLanguage: 'en',
        status: 'pending',
        translations: {}
    }
];

export const mockComments = {
    '1': [
        {
            _id: 'c1',
            postId: '1',
            userId: 'user2',
            text: 'This is gold! I had a similar situation with a client who kept asking for "more pop" in the design.',
            createdAt: new Date('2024-12-10T15:00:00')
        },
        {
            _id: 'c2',
            postId: '1',
            userId: 'user1',
            text: 'Classic! Sometimes you just have to show them the extreme to find the middle ground.',
            createdAt: new Date('2024-12-10T16:30:00')
        }
    ],
    '2': [
        {
            _id: 'c3',
            postId: '2',
            userId: 'user1',
            text: 'Healthcare workers are angels. Thank you for what you do!',
            createdAt: new Date('2024-12-09T11:00:00')
        }
    ],
    '3': [],
    '4': [
        {
            _id: 'c4',
            postId: '4',
            userId: 'user2',
            text: 'This is hilarious! What was on the secret menu?',
            createdAt: new Date('2024-12-07T10:00:00')
        }
    ],
    '5': [],
    '6': [
        {
            _id: 'c5',
            postId: '6',
            userId: 'user1',
            text: 'Heroes walk among us. Thank you for your service!',
            createdAt: new Date('2024-12-05T13:00:00')
        }
    ]
};
