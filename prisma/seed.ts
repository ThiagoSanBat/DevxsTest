import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main(){
    const expirationDelta = await prisma.parameter.create({
        data: {
            key: "expirationDelta", value: "300"
        }
    });

    console.log({expirationDelta})
}

main().catch(e => {
    console.error(e)
    process.exit(1)
}).finally(async() => {
    await prisma.$disconnect()
})