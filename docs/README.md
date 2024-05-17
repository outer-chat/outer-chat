# Developper documentation

- Table of contents
- [Getting started](#getting-started)
- [Database](#database)

## Getting started

## Database

The database is a MongoDb database. You can use the `docker-compose.yml` file at the root of the project to launch a mongo database.
The project use Prisma for the migrations and the database compliance in the Typescipt code.

> [!NOTE]
> You can see the complete schema in [data/database_schema.pdf](data/database_schema.pdf)

There is also a mermaid schema for the database:
```mermaid
erDiagram
    User {
        String id PK
        String email
        String username
        String password
        DateTime createdAt
        DateTime updatedAt
        Bytes avatar
        Bytes banner
        String bannerColor
        String bio
        UserRoles[] roles
    }
    ChannelRecipient {
        String id PK
        String channelId
        String userId
    }
    Friend {
        String id PK
        String userId
        String friendId
    }
    ServerMember {
        String id PK
        String serverId
        String userId
        UserRoles[] roles
    }
    Message {
        String id PK
        DateTime createdAt
        DateTime updatedAt
        String authorId
        String content
        String channelId
    }
    PermissionOverwrite {
        String id PK
        Int type
        String allow
        String deny
        String channelId
    }
    Channel {
        String id PK
        String name
        ChannelType type
        String topic
        Boolean nsfw
        Int bitrate
        Int userLimit
        Int rateLimitPerUser
        DateTime createdAt
        DateTime updatedAt
        String lastMessageId
        String serverId
        String description
        Int position
        String ownerId
    }
    Roles {
        String id PK
        DateTime createdAt
        DateTime updatedAt
        String name
        String[] permissions
        String color
        Boolean hoist
        Boolean mentionable
        String serverId
    }
    Log {
        String id PK
        DateTime createdAt
        DateTime updatedAt
        String type
        String message
        String serverId
        String authorId
    }
    Server {
        String id PK
        DateTime createdAt
        DateTime updatedAt
        String name
        String ownerId FK
        String memberId
        Bytes icon
        Bytes banner
        String bannerColor
        String description
    }

    User ||--o{ Message : "writes"
    User ||--o{ Friend : "has friends"
    User ||--o{ ServerMember : "is a member of"
    User ||--o{ ChannelRecipient : "is recipient of"
    User ||--o{ Channel : "owns channels"
    User ||--o{ Log : "author of logs"
    Server ||--o{ User : "owned by"
    Server ||--o{ ServerMember : "has members"
    Server ||--o{ Channel : "has channels"
    Server ||--o{ Roles : "has roles"
    Server ||--o{ Log : "has logs"
    ServerMember ||--o{ User : "has user"
    ServerMember ||--o{ Server : "belongs to server"
    ChannelRecipient ||--o{ User : "has user"
    ChannelRecipient ||--o{ Channel : "has channel"
    Friend ||--o{ User : "has user"
    Friend ||--o{ User : "is friend of"
    Message ||--o{ User : "written by"
    Message ||--o{ Channel : "in channel"
    PermissionOverwrite ||--o{ Channel : "belongs to"
    Channel ||--o{ Server : "belongs to server"
    Channel ||--o{ PermissionOverwrite : "has permissions"
    Channel ||--o{ Message : "has messages"
    Channel ||--o{ User : "owned by"
    Roles ||--o{ Server : "belongs to"
    Log ||--o{ Server : "belongs to"
    Log ||--o{ User : "written by"
```
