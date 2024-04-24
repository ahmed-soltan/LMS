const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient()

async function main(){
    try {
        await database.category.createMany({
            data: [
                {
                    name: "Computer Science"
                },
                {
                    name: "Music"
                },
                {
                    name: "Fitness"
                },
                {
                    name: "Photograpgy"
                },
                {
                    name: "Accounting"
                },
                {
                    name: "Engineering"
                },
                {
                    name: "Filming"
                },
            ]
        })

        console.log("success")
    } catch (error) {
        console.log("Error Seeding Categories" , error);
    }
}

main()


//node scripts/seed.ts