print('Start #################################################################');

rs.initiate({
    _id: 'rs0',
    members: [
        { _id: 0, host: 'host.docker.internal:27017', priority: 1 },
        { _id: 1, host: process.env.ConnectionStrings__mongodb1.replace('mongodb://', ''), priority: 0.5 },
        { _id: 2, host: process.env.ConnectionStrings__mongodb2.replace('mongodb://', ''), priority: 0.5 },
        { _id: 3, host: process.env.ConnectionStrings__mongodb3.replace('mongodb://', ''), priority: 0.5 }
    ]
});

print('END #################################################################');
