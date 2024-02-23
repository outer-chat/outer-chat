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
        string email "Unique email"
        string username "Unique username"
        string password "User password"
        datetime createdAt "Creation date"
        datetime updatedAt "Last update date"
        bytes avatar "User avatar (optional)"
        bytes banner "User banner (optional)"
        string bannerColor "Banner color (optional)"
        string bio "User biography (optional)"
        string channelId "Channel ID (optional)"
        UserRoles[] roles "User roles"
    }

    Friend {
        string id PK "Unique identifier"
        string userId "User ID"
        string friendId "Friend ID"
    }

    ServerMember {
        string id PK "Unique identifier"
        string serverId "Server ID"
        string userId "User ID"
        UserRoles[] roles "Member roles"
    }

    Message {
        string id PK "Unique identifier"
        datetime createdAt "Creation date"
        datetime updatedAt "Last update date"
        string authorId "Author ID"
        string content "Message content"
        string channelId "Channel ID"
    }

    PermissionOverwrite {
        string id PK "Unique identifier"
        int type "Overwrite type"
        string allow "Allowed permissions"
        string deny "Denied permissions"
        string channelId "Channel ID"
    }

    Channel {
        string id PK "Unique identifier"
        string name "Channel name"
        ChannelType type "Channel type"
        string topic "Topic (optional)"
        boolean nsfw "Is NSFW"
        int bitrate "Bitrate (optional)"
        int userLimit "User limit (optional)"
        int rateLimitPerUser "Rate limit per user (optional)"
        datetime createdAt "Creation date"
        datetime updatedAt "Last update date"
        string lastMessageId "Last message ID (optional)"
        string serverId "Server ID (optional)"
        string description "Description (optional)"
        int position "Position (optional)"
    }

    Roles {
        string id PK "Unique identifier"
        datetime createdAt "Creation date"
        datetime updatedAt "Last update date"
        string name "Role name"
        string[] permissions "Permissions"
        string color "Role color"
        boolean hoist "Hoist"
        boolean mentionable "Mentionable"
        string serverId "Server ID"
    }

    Log {
        string id PK "Unique identifier"
        datetime createdAt "Creation date"
        datetime updatedAt "Last update date"
        string type "Log type"
        string message "Log message"
        string serverId "Server ID"
        string authorId "Author ID (optional)"
    }

    Server {
        string id PK "Unique identifier"
        datetime createdAt "Creation date"
        datetime updatedAt "Last update date"
        string name "Server name"
        string ownerId "Owner ID"
        bytes icon "Server icon (optional)"
        bytes banner "Server banner (optional)"
        string bannerColor "Banner color (optional)"
        string description "Description (optional)"
    }

    User ||--o{ Friend : "has friends"
    User ||--o{ ServerMember : "is member of"
    User ||--o{ Message : "authors"
    User ||--o{ Log : "logs"
    User ||--|| Channel : "has channel"
    User ||--|| Server : "owns"

    Friend ||--|| User : "friends with"

    ServerMember }|--|| Server : "belongs to"
    ServerMember }|--|| User : "is user"

    Message }|--|| User : "authored by"
    Message }|--|| Channel : "belongs to"

    PermissionOverwrite }|--|| Channel : "overwrites permissions for"

    Channel }|--o{ Message : "contains"
    Channel }|--|| PermissionOverwrite : "has permission overwrites"
    Channel ||--|| Server : "belongs to"
    Channel }|--o{ User : "has recipients"

    Roles }|--|| Server : "belongs to"

    Log }|--|| Server : "logs for"
    Log }|--o{ User : "authored by"

    Server ||--o{ ServerMember : "has members"
    Server ||--o{ Channel : "contains channels"
    Server ||--o{ Roles : "has roles"
    Server ||--o{ Log : "has logs"
```
