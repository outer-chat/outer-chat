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
        string id PK "Unique identifier"
        string email "Unique email address"
        string username "Unique username"
        string password "User password"
        datetime createdAt "Creation time"
        datetime updatedAt "Last update time"
        bytes avatar "User avatar (optional)"
        bytes banner "User banner (optional)"
        string bannerColor "Banner color (optional)"
        string bio "User biography (optional)"
        string serverId FK "Server ID"
        string channelId FK "Channel ID"
        UserRoles[] roles "User roles"
    }

    Message {
        string id PK "Unique identifier"
        datetime createdAt "Creation time"
        datetime updatedAt "Last update time"
        string authorId FK "Author ID"
        string content "Message content"
        string channelId FK "Channel ID"
    }

    Channel {
        string id PK "Unique identifier"
        string name "Channel name"
        ChannelType type "Channel type"
        string topic "Channel topic (optional)"
        boolean nsfw "Is NSFW"
        int bitrate "Bitrate (optional)"
        int userLimit "User limit (optional)"
        int rateLimitPerUser "Rate limit per user (optional)"
        datetime createdAt "Creation time"
        datetime updatedAt "Last update time"
        string lastMessageId "Last message ID (optional)"
        string serverId FK "Server ID"
        string description "Channel description (optional)"
        int position "Channel position (optional)"
    }

    Server {
        string id PK "Unique identifier"
        datetime createdAt "Creation time"
        datetime updatedAt "Last update time"
        string name "Server name"
    }

    PermissionOverwrite {
        string id PK "Unique identifier"
        int type "Overwrite type"
        string allow "Allowed permissions"
        string deny "Denied permissions"
        string channelId FK "Channel ID"
    }

    User ||--o{ Message : "writes"
    User ||--o{ Channel : "has"
    Channel ||--o{ Message : "contains"
    Server ||--o{ Channel : "hosts"
    User }o--o{ Server : "joins"
    Channel ||--|{ PermissionOverwrite : "defines permissions for"
```
