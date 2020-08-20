db.createUser(
    {
        user: "mongo",
        pwd: "Mongo1",
        roles: [
            {
                role: "readWrite",
                db: "sprinkler"
            }
        ]
    }
)
