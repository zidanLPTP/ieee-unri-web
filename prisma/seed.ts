import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const leaders = [
  { role: "Advisor", name: "Assoc. Prof. Yusnita Rahayu, S.T, M.Eng, Ph.D, SMIEEE", image: "/person.svg", memberId: null, division: "Advisory Board", targetRole: Role.CORE },
  { role: "Counselor", name: "Ika Mayla Sari, S.T, M.T", image: "/person.svg", memberId: null, division: "Advisory Board", targetRole: Role.CORE },
  { role: "Director", name: "Rangga Byian Tri Putra", image: "/person.svg", memberId: "100185939", division: "Executive Board", targetRole: Role.CORE },
  { role: "Vice Director I", name: "Hasby Fakhrezi Kamal", image: "/person.svg", memberId: "101969467", division: "Executive Board", targetRole: Role.CORE },
  { role: "Vice Director II", name: "Sofa Dwi Putra", image: "/person.svg", memberId: "101980104", division: "Executive Board", targetRole: Role.CORE },
  { role: "Vice Director III", name: "Muhammad Erwa Sandyka", image: "/person.svg", memberId: "101969542", division: "Executive Board", targetRole: Role.CORE }
]

const divisions = [
  {
    name: "Secretariat",
    coordinator: { name: "Laila Karunia", memberId: "101979630", image: "/person.svg" },
    members: [
      { name: "Aris Tri Cahya Wardhana", memberId: "101976390", image: "/person.svg", role: "Staff" }
    ]
  },
  {
    name: "Information & Creative Media",
    coordinator: { name: "Diva Septiana Devani", memberId: "101980099", image: "/person.svg" },
    members: [
      { name: "Fathin Ahmad Zidan", memberId: "102004523", image: "/person.svg", role: "Web Master" }
    ]
  },
  {
    name: "Business Affairs",
    coordinator: { name: "Aida Fitri Rahman", memberId: "101979713", image: "/person.svg" },
    members: [
      { name: "Rizki wahyudi", memberId: "102007179", image: "/person.svg", role: "Staff" }
    ]
  },
  {
    name: "Education",
    coordinator: { name: "Jessyca Hayfa", memberId: "101977177", image: "/person.svg" },
    members: [
      { name: "Dini Khoirunnisa Purba", memberId: "101979824", image: "/person.svg", role: "Staff" }
    ]
  },
  {
    name: "Membership & Internal Relations",
    coordinator: { name: "Wenfey Estefan", memberId: "101976323", image: "/person.svg" },
    members: [
      { name: "Deval Athaya Saputra", memberId: "101974122", image: "/person.svg", role: "Staff" }
    ]
  },
  {
    name: "Public Relations & Partnership",
    coordinator: { name: "Naufal Labib Ramadhani", memberId: "101992101", image: "/person.svg" },
    members: [
      { name: "Rexsya Dwi Prayogi", memberId: "101976386", image: "/person.svg", role: "Staff" }
    ]
  }
]

async function main() {
  console.log('🚀 Mulai seeding data IEEE UNRI...')

  await prisma.officer.deleteMany({})
  
  let orderCounter = 1

  for (const leader of leaders) {
    const rawPassword = leader.memberId || "123456"
    const hashedPassword = await bcrypt.hash(rawPassword, 10)

    await prisma.officer.create({
      data: {
        name: leader.name,
        position: leader.role,
        division: leader.division,
        image: leader.image,
        memberId: leader.memberId,
        password: hashedPassword,
        accessRole: leader.targetRole,
        order: orderCounter++
      }
    })
  }

  for (const div of divisions) {
    const headPasswordRaw = div.coordinator.memberId
    const headPasswordHash = await bcrypt.hash(headPasswordRaw, 10)

    await prisma.officer.create({
      data: {
        name: div.coordinator.name,
        position: "Head of Division",
        division: div.name,
        image: div.coordinator.image,
        memberId: div.coordinator.memberId,
        password: headPasswordHash,
        accessRole: Role.HEAD,
        order: orderCounter++
      }
    })

    for (const member of div.members) {
        let userAccessRole: Role = Role.STAFF
        if (member.role === "Web Master") {
            userAccessRole = Role.ADMIN
        }

        const memberPasswordRaw = member.memberId
        const memberPasswordHash = await bcrypt.hash(memberPasswordRaw, 10)

        await prisma.officer.create({
            data: {
                name: member.name,
                position: member.role,
                division: div.name,
                image: member.image,
                memberId: member.memberId,
                password: memberPasswordHash,
                accessRole: userAccessRole,
                order: orderCounter++
            }
        })
    }
  }

  console.log('✅ Seeding selesai! Semua akun sudah punya password (Default = Member ID).')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })