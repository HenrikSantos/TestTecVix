import { Prisma, PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const SEEDS_FOLDER_NAME = ""; // "seeds" folder inside temp folder: ex: "temp/SEEDS_FOLDER_NAME"

async function seedTestUsers() {
  console.log("------ Seeding test users ----------------");

  const testUsers = [
    {
      username: "admin",
      email: "admin@vituax.com",
      password: "Admin@123",
      role: "admin" as const,
      isActive: true,
      fullName: "Admin Vituax",
      userPhoneNumber: "(11) 99999-9999",
      field: "IT",
      department: "Board",
      idBrandMaster: null,
    },
    {
      username: "manager",
      email: "manager@vituax.com",
      password: "Manager@123",
      role: "manager" as const,
      isActive: true,
      fullName: "Manager Vituax",
      userPhoneNumber: "(11) 99999-9999",
      field: "IT",
      department: "Management",
      idBrandMaster: null,
    },
    {
      username: "member",
      email: "member@vituax.com",
      password: "Member@123",
      role: "member" as const,
      isActive: true,
      fullName: "Member Vituax",
      userPhoneNumber: "(11) 99999-9999",
      field: "IT",
      department: "Development",
      idBrandMaster: null,
    },
    {
      username: "admin_upix",
      email: "admin@upix.com",
      password: "Admin@123",
      role: "admin" as const,
      isActive: true,
      fullName: "Admin UPIX",
      userPhoneNumber: "(11) 99999-9999",
      field: "Telecom",
      department: "Board",
      idBrandMaster: 1,
    },
    {
      username: "manager_upix",
      email: "manager@upix.com",
      password: "Manager@123",
      role: "manager" as const,
      isActive: true,
      fullName: "Manager UPIX",
      userPhoneNumber: "(11) 99999-9999",
      field: "Telecom",
      department: "Management",
      idBrandMaster: 1,
    },
    {
      username: "member_upix",
      email: "member@upix.com",
      password: "Member@123",
      role: "member" as const,
      isActive: true,
      fullName: "Member UPIX",
      userPhoneNumber: "(11) 99999-9999",
      field: "Telecom",
      department: "Support",
      idBrandMaster: 1,
    },
    {
      username: "admin_vituax_msp",
      email: "admin@vituaxmsp.com",
      password: "Admin@123",
      role: "admin" as const,
      isActive: true,
      fullName: "Admin Vituax MSP",
      userPhoneNumber: "(11) 99999-9999",
      field: "Cloud",
      department: "Board",
      idBrandMaster: 2,
    },
  ];

  for (const user of testUsers) {
    const existingUser = await prisma.user.findFirst({
      where: { email: user.email },
    });

    if (existingUser) {
      console.log(`Usuario ${user.email} ja existe, pulando...`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);

    await prisma.user.create({
      data: {
        username: user.username,
        email: user.email,
        password: hashedPassword,
        role: user.role,
        isActive: user.isActive,
        fullName: user.fullName,
        userPhoneNumber: user.userPhoneNumber,
        field: user.field,
        department: user.department,
        idBrandMaster: user.idBrandMaster,
      },
    });

    console.log(`Usuario ${user.email} criado com sucesso!`);
  }

  console.log("------ Test users seeded ----------------");
}

async function main() {
  const isDroped = true;
  let limit = 10;

  let tablesTryAgain: Prisma.ModelName[] = [];
  const tables = Object.keys(Prisma.ModelName) as Prisma.ModelName[];
  const MAX = limit;

  const snakeToCamel = (str: string) =>
    str.toLocaleLowerCase().replace(/([-_][a-z0-9])/g, (undeScoreAndString) => {
      return undeScoreAndString.toUpperCase().replace("-", "").replace("_", "");
    });

  const readFile = async (path: string) => {
    try {
      const data = await fs.readFile(
        `./temp/${SEEDS_FOLDER_NAME || "seeds"}/${path}`,
        "utf8",
      );
      const dataParse = JSON.parse(data);
      if (Array.isArray(dataParse)) return dataParse;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      /* empty */
    }
    return [];
  };

  const seedTable = async (table: Prisma.ModelName) => {
    const data = await readFile(`${snakeToCamel(table)}.json`);

    try {
      tablesTryAgain = tablesTryAgain.filter((t) => t !== table);
      // @ts-expect-error ts(2349)
      await prisma[table].createMany({ data });
    } catch (error) {
      if (
        error instanceof Error ||
        error instanceof Prisma.PrismaClientKnownRequestError ||
        error instanceof Prisma.PrismaClientUnknownRequestError ||
        error instanceof Prisma.PrismaClientRustPanicError
      ) {
        if (error.message.toLowerCase().includes("bigint")) {
          try {
            const newData = data.map((item) => {
              return { ...item, sent_timestamp: BigInt(item.sent_timestamp) };
            });
            // @ts-expect-error ts(2349)
            await prisma[table].createMany({
              data: newData,
            });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (err) {
            /* empty */
          }
        } else if (!error.message.toLowerCase().includes("unique constraint")) {
          tablesTryAgain.push(table);
        }
      }
    }
  };

  const dropAll = async (arrTables = tables) => {
    for (let i = 0; i < arrTables.length; i++) {
      const table = arrTables[i];
      try {
        tablesTryAgain = tablesTryAgain.filter((t) => t !== table);
        // @ts-expect-error ts(2349)
        await prisma[table].deleteMany({});
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        tablesTryAgain.push(table);
      }
    }
  };
  const seedAll = async () => {
    for (let i = 0; i < tables.length; i++) {
      await seedTable(tables[i] as Prisma.ModelName);
    }
  };
  console.clear();
  console.log("----------------------------");

  if (isDroped) {
    await dropAll();
    if (tablesTryAgain.length > 0) {
      while (tablesTryAgain.length > 0 && limit-- > 0) {
        await dropAll(tablesTryAgain);
      }
    }
    console.log(
      "The end",
      tablesTryAgain,
      "<-- Tables to seed (Number of Fails [${tablesTryAgain.length}]) | Number of trys: ",
      MAX - limit,
    );
    console.log("------END---DROP--ALL--XXXXX--------------");
    limit = MAX;
    tablesTryAgain = [];
  }

  console.log("------ Wait for seed all ----------------");
  await seedAll();
  await seedTestUsers();

  if (tablesTryAgain.length > 0) {
    while (tablesTryAgain.length > 0 && limit-- > 0) {
      await seedAll();
    }
  }

  console.log(
    "The end",
    tablesTryAgain,
    "<-- Tables to seed (Number of Fails [${tablesTryAgain.length}]) | Number of trys: ",
    MAX - limit,
  );
}

main()
  .then(async () => {
    console.log("Seeding finished.");
  })
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
