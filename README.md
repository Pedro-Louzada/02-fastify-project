# Fastify

Micro framework (considerado micro por não trazer opiniões fortes, organização de pastas, nome de arquivos e etc);
Um dos mais atuais sendo utilizados e frequetemente atualizado;

=> Vantagens

perfomático;
TS integrado a sua estrutura, não necessitando de libs externas;
assincronismo do JS mais moderno;
liberdade de organização de pasta, utilização de ferramentas, etc;

=> Instalação

$ npm i fastify

# Type Script <==> NodeJS

O Node não entende TS como padrão então teremos que instalar como dependencia
de desenvolvimento o typescript.

=> Instalação (ambiente de dev)

$ npm install -D typescript

=> Criando o arquivo de configuração do TS (tsconfig.json)

$ npx tsc --init

Moficação dentro do arquivo tsconfig.json para a versão mais recente do JS

Eg: target: "es2016" para "es2020"

=> Instalando dependencias do TS para o NodeJs

$ npm i -D @types/node

=> Instalando compilador automático de TS para JS

$ npm i tsx -D

=> Rodando meu arquivo ts utilizando o tsx

$ tsx src/app.ts

# EsLint

=> Instalando com a tipagem da rocketseat para Node

$ npm i eslint @rocketseat/eslint-config -D

Para configurar o ESLint seguindo template da rocket, nós temos que criar um
arquivo .eslintrc.json e nele colocarmos o seguinte código:

```json
  {
    "extends": [
      "@rocketseat/eslint-config/node"
    ]
  }
```

=> Script para ajustar todos os erros presentes no código automaticamente

$ "lint": eslint src --ext .ts --fix

$ npm run lint

Obs: Lembrar de selecionar o final de linha "LF" e não "CRLF".

LF (Line Feed) e CRLF (Carriage Return + Line Feed) são diferentes formas de
representar a quebra de linha em arquivos de texto.
A principal diferença entre eles está no número e no tipo de caracteres usados
para indicar essa quebra.

# Query Builder

Biblioteca para realizar querys em banco de dados, naõ se preocupando
com a sintaxe de query de banco de dados, ficando com a estrutura
mais parecida com a linguagem, sendo mais prático.

=> Knex (query builder)

Instalando o query builder

$ npm i knex

Instalando o driver do banco de dados que iremos utilizar

$ npm install pg
$ npm install pg-native
$ npm install sqlite3
$ npm install better-sqlite3
$ npm install mysql
$ npm install mysql2
$ npm install oracledb
$ npm install tedious

=> Configuração do knex para sqlite

```ts
import { knex as setupKnex } from "knex";

export const knex = setupKnex({
  // type database
  client: "sqlite",
  // connection config
  connection: {
    // database file path (where database file will stay)
    filename: "./db/app.db",
    },
  }
);
```

O parâmetro "filename" indica onde faremos nossa busca,
quando ainda não existe o arquivo ele simplesmente cria um em branco.

Agora basta chamar esta constante que poderemos utilizar este query builder.

# Migrations (Controle de versões do banco de dados)

Para criar nossa primeira migration precisamos criar um arquivo de ref para que o knex
saiba quais são as configurações do nosso banco. Por convensão criamos um arquivo chamado
knexfile.ts, importando somente as configurações do nosso banco e exportamos como padrão.

Como padrão o knex entende arquivos ".js", como criamos o arquvio de config
com a extensão ".ts" ele vai desconhecer, neste caso, devemos padronizar
para que possamos rodar o comando para criar a migration já transpilando nosso
arquivo ".ts" para ".js".

O knex não tem nativamente suporte para a biblioteca tsx, para isso devemos
adicionar em nosso arquivo "package.json" um script de atalho:

MAC / Linux

$ "knex": "node --no-warnings --import tsx ./node_modules/.bin/knex"

Windows

$ "knex": "tsx ./node_modules/knex/bin/cli.js"

Para criar nossa migration chamarem o script da seguinte:

npm run knex -- migrate:make "nome_da_ação"

Para configurarmos o caminho que o arquivo de migration será criado devemos adicionar
na configuração do knex a seguinte linha de código:

```js
migrations: {
  extension: 'ts',
  // path of migration file
   directory: './db/migrations',
}
```

Em nossos arquivos de migration existem 2 métodos, um chamado up
e outro chamado down. O método up nós colocaremos o que iremos realizar
dentro do banco de dados naquela migration e o método down seria um rollback
se algo de errado acontecer, para sempre termos o caminho inverso do que
estamos fazendo nesta versão da migration.

Eg:

```ts
import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("transaction", (table) => {
    // primary key
    table.uuid("id").primary();
    // notNullable significa que não pode ser nulo
    table.text("title").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  // dropTable => defaz a tabela
  await knex.schema.dropTable("transaction");
}
```

Obs: Utilizamos o "schema" quando estamos lidando com a estrutura do banco.

Para executar minha migration eu chamo no terminal:

$ npm run knex -- migrate:latest

Para executar um rollback na minha migration eu chamo no terminal:

$ npm run knex -- migrate:rollback

Obs: Só fazer rollback antes de fazer deploy em prd

# Variáveis de ambiente

Para trabalhar com elas devemos instalar a extensão "Dotenv", para que no arquivo 
".env" a sintaxe fique de acordo com os padrões de variável de ambiente.

Para que possamos ler arquivos de variáveis de ambiente dentro do Node, devemos
instalar a biblioteca ".env".

Primeiramente criamos um arquivo na raiz chamado ".env" e colocaremos as variáveis
que utilizaremos dentro de nossa API, importante lembrar que em nosso gitignore
devemos passar este arquivo para não subirmos dados sensíveis ao git.

Para os devs se basearem ao acessar seu projeto e saberem quais variáveis
utilizar, criaremos um arquivo chamado ".env.example" e fazaremos uma cópia
das nossas variáveis porém as sensíveis deixaremos em branco.

=> Validação das variáveis:

$ npm i zod

A biblioteca zod serve para validarmos não somente as variáveis de ambiente,
como parâmetros de rotas por exemplo.

Criando uma pasta env dentro de src, crie um arquivo chamado env:

Eg:

```ts
import "dotenv/config";
import { z } from "zod";

// formato de dados das variáveis de ambiente

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
  DATABASE_URL: z.string(),
  PORT: z.number().default(3333),
});

// métodos parse() ou safaParse() servem para testar nosso schema.

// safeParse() conseguimos modificar nosso retorno de erro.

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("⚠️ Invalid environment variables!", _env.error.format());

  throw new Error("Invalid environment variables!");
}

export const env = _env.data;
```

Bastando chamar esta variável para puxar as variáveis de ambiente e assim
que chamarmos já estará validando se as mesmas seguem a regra correta.

# Plugins

No Fastify chamamos de plugins as pequenas partes do projeto que vamos
individualizando, no caso, por exemplo as rotas.

Para registrarmos os plugins ao nosso servidor, devemos fazer da seguinte forma:

```ts
import fastify from "fastify";
import { env } from "./env";
import { transactionsRoutes } from "./routes/transactionsRoutes";

const app = fastify();

app.register(transactionsRoutes, {
  prefix: "transactions",
});
```

No caso, utilizamos a função "register" para registrar nosso plugin,
e o objeto como segundo parâmetro podemos setar algumas informações para
a execução do nosso plugin, que neste caso este plugin será ativado quando
a rota acessado seja 'transactions', que neste
caso é um plugin onde manipulam as rotas da nossa aplicação:

```ts
import { FastifyInstance } from "fastify";
import { knex } from "../database";

export function transactionsRoutes(app: FastifyInstance) {
  // calling the method
  app.post("/", async (request, reply) => {
    const createTransactionSchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["credit", "debit"]),
    });

    const { title, amount, type } = createTransactionSchema.parse(request.body);

    await knex("transactions").insert({
      id: randomUUID(),
      title,
      amount: type === "credit" ? amount : amount * -1,
    });

    return reply.status(201).send();
  });
}
```

# Tipagem knex tables

Para não termos problemas em adicionar novos campos em uma tabela e por ventura
inserirmos um campo que não existe, podemos tipar nossas tabelas para que quando
formos fazer qualquer tipo de ação, saberemos quais campos aquela tabela tem.

Eg:

```ts
// eslint-disable-next-line
import { Knex } from "knex";

declare module "knex/types/tables" {
  export interface Tables {
    transactions: {
      id: string;
      title: string;
      amount: number;
      created_at: string;
      session_id?: string;
    };
  }
}
```

Obs: Lembrando que arquivos que declaram tipagens terão somente códigos ts, e sua
extensão será "nomeDoArquivo.d.ts", d significa declaração.

# Cookies

=> O que são Cookies?

É uma maneira de guardar informações do usuário que está navegando na aplicação
de maniera individual, onde podemos utilizar estas informações do mesmo em suas
próximas interações. Normalmente guardamos esta informação por sessão, e a mesma
tem um tempo determinado de expiração.

=> Caso de uso:

Em nossa aplicação onde o usuário cria transações, não faz sentido ele listar,
por exemplo, transações que não foi ele quem criou, nestes casos, em nossa
primeira rota de criação iremos validar se dentro dos cookies da nossa aplicação
já existe algum interligado à aquele usuário, se sim, tomaremos qualquer
tipo de ação respeitando limite por usuário, se não criaremos um cookie de sessão
para este usuário, para que nas próximas ações possamos filtrar as informações
solicitadas somente para aquele usuário.

=> Facilitando a tratativa de cookies dentro do fastify

$ npm install @fastify/cookie

=> Verificando e setando cookie

```js
  app.post('/', async (request, reply) => {
    const createTransactionSchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionSchema.parse(request.body)
    // consultando o cookie
    let { sessionId } = request.cookies

    if (!sessionId) {
      sessionId = randomUUID()
      // cadastrando o cookie
      reply.setCookie('sessionId', sessionId, {
        // caminho onde poderemos enxergar o cookie
        path: '/',
        // tempo de expiração do cookie
        maxAge: 60 * 24 * 7, // 7 dias
      })
    }

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    })

    return reply.status(201).send()
  })
```

=> Validando cookie

Antes das rotas podemos adicionar algumas ações para serem executadas nesta rota.
Neste caso, o preHandler, serve para fazer algo antes de lidar com a rota.
Colocamos dentro do array por que podemos cadastrar mais de uma função a ser executada.

```js
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const transactions = await knex('transactions')
        .where('session_id', sessionId)
        .select()

      return reply.status(200).send({ transactions })
    },
  )
```

=> Função de validação dos cookies para ser aplicada nas rotas

```js
  export async function checkSessionIdExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { sessionId } = request.cookies

  if (!sessionId) {
    return reply.status(401).send({
      error: 'Unauthorized',
    })
  }
}
```

# Hook Global

Hooks globais servem para aplicar alguma funcionalidade de maneira global e centralizada.
No caso, utilizando o preHandler, teremos que adicionar rota a rota esta função.
Podemos aplicar em todas as rotas que estão dentro do contexto da função, aplicando
um hook global.

=> Criando hook

```js
  export function transactionsRoutes(app: FastifyInstance) {
    // Existem varias funcionalidades para ser adicionado como hookie.
    // Uma delas é o preHandler, e o 2º paramêtro seria a função a ser aplicada.
    // Ativando a função de maneira global em todo contexto das rotas.
  app.addHook('preHandler', checkSessionIdExists)

  ...

  }
```

# Testes automatizados

3 tipos de testes mais utilizados:

=> unitários: testa uma unidade da sua aplicação, um pedaço

=> integrações: testa a comunicação entre 2 ou mais unidades

=> e2e - ponta a ponta: simulam um usuário utilizando a operação

Pirâmide de teste:

MUITOS testes unitários;
MÉDIOS testes de integração;
POUCOS testes E2E;

Framework para realizar o teste: Vitest

=> A forma como descrevemos os testes é idêntica ao Jest, contudo
o Vitest realiza os testes mais rápidos por diversos motivos.

=> Tem suporte automática para TS, ECM, JSX, etc.

=> Totalmente compatível com o Jest;

Instalação do Vitest

$ npm i vitest -D

Eg:

```ts
import { test, expect } from 'vitest'

test('enunciado do teste', () => {
  //ação que o teste deve fazer

  //validação se o teste foi eficaz
  expect(...)
})
```

=> Extensão para arquivos de test "file.spec.ts"

Para que possamos simular em nossos testes a chamada HTTP, iremos
utilizar a lib supertest.

Contudo esta lib foi desenvolvida em JS, então teremos que instalar
o pacote de types desta lib também.

Instalação:

$ npm i supertest @types/supertest -D

Para simularmos nossa chamada, teremos que individualizar um arquivo
onde escutando nosso servidor em uma porta específica, e outro arquivo
onde simplesmente criamos nosso servidor para podermos simular sem que
o mesmo esteja no ar. Neste caso, divimos em nossa aplicação a criação
do servidor no arquivo server.ts e a execução do mesmo no arquivo app.ts

Em nossos testes devemos aguardar para que antes de iniciarmos, todas as
dependências do nosso servidor estejam funcionando, como por exemplo,
leitura de plugin.

Com isso em nosso arquivo de teste podemos executar certos comandos antes
mesmos de nosso teste ser executado.

Eg:

```ts
import { test, beforeAll, afterAll } from 'vitest'
// simulate server
import request from 'supertest'
// import the server creation
import { app } from '../src/server'

beforeAll(async () => {
  await app.ready()
}) // await app to be online

afterAll(async () => {
  await app.close()
}) // close server in the end

test('user can create a new transaction', async () => {
  // always put app.server to simulate server
  await request(app.server)
    .post('/transactions')
    .send({
      title: 'New transaction',
      amount: 5000,
      type: 'credit',
    })
    .expect(201)
})
```

Para descrever os testes e quando falhar demostrar qual teste e de qual
categoria foi colocaremos todo o teste dentro da uma callback de um método
chamado "describe":

Eg:

```ts
import { test, beforeAll, afterAll } from 'vitest'
// simulate server
import request from 'supertest'
// import the server creation
import { app } from '../src/server'

describe('Transactions routes', () => {
  beforeAll(async () => {
  await app.ready()
}) // await app to be online

afterAll(async () => {
  await app.close()
}) // close server in the end

test('user can create a new transaction', async () => {
  // always put app.server to simulate server
  await request(app.server)
    .post('/transactions')
    .send({
      title: 'New transaction',
      amount: 5000,
      type: 'credit',
    })
    .expect(201)
})
})
```

Observações: JAMAIS fazer que um teste dependa do outro, se depender o
melhor seria os dois fazerem parte de um teste só.

Para que em nossos testes nós não popularmos nosso banco de dados, devemos
nos testes modificar o apontamento do banco para o de teste e não de dev ou prd.

Para fazermos isto, como nosso caminho para salvar as informações no banco estão está
salvo como uma variável de ambiente, devemos modifica-la para que em ambiente de teste
ele mude a busca do arquivo e salve em um novo banco.

Para isto, iremos modificar nosso arquivo de validação de variáveis ambiente:

Normalmente importamos o 'dotenv/config' direto para que ele aplica o código
inserido no arquivo, exatamente no arquivo ".env" econtrado na raiz do projeto.

Porém como queremos mudar o caminho do arquivo do banco para o ambiente de teste
faremos da seguinte maneira:

```js
import { config } from 'dotenv'
import { z } from 'zod'

// Esta variavel ambiente NODE_ENV é criada com este valor de maneira automática quando rodamos a chamada de testes.
if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test'})
} else {
  // não passando nada ele procura pelo arquivo ".env" na raiz do projeto
  config()
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_URL: z.string(),
  PORT: z.number().default(3333),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('⚠️ Invalid environment variables!', _env.error.format())

  throw new Error('Invalid environment variables!')
}

export const env = _env.data

```

Contudo como estamos em um banco novo, precisamos criar as migrations criadas para dev nos testes,
e omo boa prática limpamos e recriamos o banco em cada teste feito, desta forma, faremos a seguinte
ação:

```js
import { config } from 'dotenv'
import { execSync } from 'node:child_process'
import { z } from 'zod'

// Esta variavel ambiente NODE_ENV é criada com este valor de maneira automática quando rodamos a chamada de testes.
if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test'})
} else {
  // não passando nada ele procura pelo arquivo ".env" na raiz do projeto
  config()
}

// Antes de cada teste iremos realizar uma ação
beforeEach(() => {
  // método utilizado para fazermos chamado no terminal via script
  execSync('npm run knex migrate:rollback --all') // desfaz todas as migrations, chama o método down da migration
  execSync('npm run knex migrate:latest') // cria as migrations novamente
})

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_URL: z.string(),
  PORT: z.number().default(3333),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('⚠️ Invalid environment variables!', _env.error.format())

  throw new Error('Invalid environment variables!')
}

export const env = _env.data

```

# Build

Biblioteca para transcrever TS para JS em meu build

$ npm install tsup -D

Devemos adicionar um script no arquivo "package.json",
chamado "build" com o valor "tsup src --out-dir build", para que
quando rodar o comando de build criarmos uma pasta chamada "build"
transcrevendo nossa pasta src em JS.

Devemos adicionar nossa pasta build no arquivo ".gitignore"
e também devemos criar um arquivo chamado ".eslintignore"
guardando a pasta build e node_modules para que não aplique
ESLint nestas pastas.

Buildando nossa aplicação:

$ node build/server.js


