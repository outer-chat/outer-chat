using Microsoft.Extensions.Hosting;

var builder = DistributedApplication.CreateBuilder(args);

var script = builder.Environment.IsDevelopment() ? "start:dev" : "start:prod";

var replSet = new List<IResourceBuilder<MongoDBServerResource>>();

Directory.CreateDirectory($"mongodb/data");
for (int i = 1; i <= 3; i++)
{
    string name = $"mongodb{i}";
    Directory.CreateDirectory($"mongodb/data/{i}");
    replSet.Add(builder.AddMongoDB(name)
        .WithArgs("--replSet", "rs0", "--bind_ip_all", "--shardsvr")
        .WithInitBindMount("mongodb/init/shard"));
        // .WithDataBindMount($"mongodb/data/{i}"));
}

Directory.CreateDirectory($"mongodb/data/0");
var mongodbBuilder = builder.AddMongoDB("mongodb");
foreach (var rs in replSet)
    mongodbBuilder.WithReference(rs);
var mongodb = mongodbBuilder.WithArgs("--replSet", "rs0", "--bind_ip_all", "--port", "27017")
    .WithInitBindMount("mongodb/init/main")
    .WithContainerRunArgs("--add-host", "host.docker.internal:172.17.0.1")
    .WithEndpoint(name: "mongodb", port: 27017, targetPort: 27017)
    // .WithDataBindMount("mongodb/data/0")
    .AddDatabase("outerchat");

builder.AddNpmApp("api", "../server/", scriptName: script)
    .WithHttpEndpoint(env: "PORT")
    .WithEnvironment("SECRET", builder.Configuration["SECRET"])
    .WithReference(mongodb)
    .WithExternalHttpEndpoints();

var app = builder.Build();

await app.RunAsync();
