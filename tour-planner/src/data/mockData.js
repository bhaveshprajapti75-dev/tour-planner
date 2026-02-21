export const cities = [
    {
        id: 'zurich',
        name: 'Zurich',
        image: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&q=80&w=800',
        description: 'A global center for banking and finance, lies at the north end of Lake Zurich in northern Switzerland.'
    },
    {
        id: 'lucerne',
        name: 'Lucerne',
        image: 'https://images.unsplash.com/photo-1528659187310-917ce5cb892e?auto=format&fit=crop&q=80&w=800',
        description: 'A compact city in Switzerland known for its preserved medieval architecture, sits amid snowcapped mountains on Lake Lucerne.'
    },
    {
        id: 'interlaken',
        name: 'Interlaken',
        image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&q=80&w=800',
        description: 'A traditional resort town in the mountainous Bernese Oberland region of central Switzerland.'
    },
    {
        id: 'bern',
        name: 'Bern',
        image: 'https://images.unsplash.com/photo-1589148386445-56f87455b85a?auto=format&fit=crop&q=80&w=800',
        description: 'The capital city of Switzerland, built around a crook in the Aare River.'
    },
    {
        id: 'zermatt',
        name: 'Zermatt',
        image: 'https://images.unsplash.com/photo-1531737212413-667205e1cda7?auto=format&fit=crop&q=80&w=800',
        description: 'A mountain resort renowned for skiing, climbing and hiking, lies below the iconic, pyramid-shaped Matterhorn peak.'
    }
];

export const activities = [
    // Zurich Activities
    {
        id: 'act_1',
        cityId: 'zurich',
        title: 'Rhine Falls',
        shift: 'Evening',
        price: 45,
        duration: '3 hours',
        image: 'https://images.unsplash.com/photo-1536696429535-626dfedb3260?auto=format&fit=crop&q=80&w=800',
        inclusions: ['Transport', 'Entry Ticket'],
        description: "Europe's largest waterfall, the majestic Rhine Falls near Schaffhausen, offers a powerful sensory experience."
    },
    {
        id: 'act_2',
        cityId: 'zurich',
        title: 'Walking tour of Zurich',
        shift: 'Morning',
        price: 0,
        duration: '2 hours',
        image: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&q=80&w=800',
        inclusions: ['Guide'],
        description: "Start with a walking tour of the Old Town. Discover the history and culture of Zurich."
    },
    // Lucerne Activities
    {
        id: 'act_3',
        cityId: 'lucerne',
        title: 'Swiss Transport Museum',
        shift: 'Morning',
        price: 60,
        duration: '4 hours',
        image: 'https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?auto=format&fit=crop&q=80&w=800',
        inclusions: ['Entry Ticket', 'Planetarium'],
        description: "The most visited museum in Switzerland - Experience the history of transport."
    },
    {
        id: 'act_4',
        cityId: 'lucerne',
        title: 'Lake Lucerne Cruise',
        shift: 'Evening',
        price: 40,
        duration: '2 hours',
        image: 'https://images.unsplash.com/photo-1527631746654-2195821f51ee?auto=format&fit=crop&q=80&w=800',
        inclusions: ['Cruise Ticket'],
        description: "Set sail on a Lake Lucerne cruise and take in the captivating charm of the town."
    },
    // Interlaken Activities
    {
        id: 'act_5',
        cityId: 'interlaken',
        title: 'Lauterbrunnen Valley Walk',
        shift: 'Noon',
        price: 20,
        duration: '3 hours',
        image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&q=80&w=800',
        inclusions: ['Transport to Valley'],
        description: "The Lauterbrunnen Valley Walk is a gentle, mostly flat trail that winds through a glacial valley nestled between towering cliffs."
    }
];

export const hotels = [
    { id: 'hot_1', cityId: 'zurich', name: 'Hotel Welcome Inn Zurich Airport', category: '3 Star', price: 120, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800' },
    { id: 'hot_2', cityId: 'zurich', name: 'Zurich Marriott Hotel', category: '5 Star', price: 350, image: 'https://images.unsplash.com/photo-1551882547-ff40c0d13c05?auto=format&fit=crop&q=80&w=800' },
    { id: 'hot_3', cityId: 'lucerne', name: 'Hotel Rothaus Lucerne', category: '3 Star', price: 110, image: 'https://images.unsplash.com/photo-1542314831-c6a420325160?auto=format&fit=crop&q=80&w=800' },
    { id: 'hot_4', cityId: 'interlaken', name: 'Hotel Weisses Kreuz', category: '4 Star', price: 180, image: 'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&q=80&w=800' },
    { id: 'hot_5', cityId: 'bern', name: 'Hotel City am Bahnhof', category: '4 Star', price: 160, image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=800' },
];

export const passes = [
    { id: 'pass_1', name: '8 Days Swiss Travel Pass Standard Class', price: 450 }
];

// Admin Mock Data
export const projectsData = [
    { id: '23', name: 'Jain Sangh & Trust Portal', client: 'Jayesh Doshi', date: 'Jan 10, 2026', quoted: 'Yes', amount: 'INR 1,27,677', status: 'In Progress' },
    { id: '24', name: 'Patel Family Swiss Tour', client: 'Rajesh Patel', date: 'Feb 15, 2026', quoted: 'Yes', amount: 'INR 2,45,000', status: 'Pending' },
    { id: '25', name: 'Honeymoon Package', client: 'Sanjay Sharma', date: 'Feb 20, 2026', quoted: 'No', amount: '-', status: 'New Inquiry' },
];
