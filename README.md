# Araújo Esportes — catálogo e pedidos

Loja de artigos esportivos com catálogo por categoria, carrinho e preparação de pedidos pelo WhatsApp. Inclui painel para manutenção de produtos integrado ao Firebase.

## Funcionalidades

- Categorias de camisas, calçados, acessórios e bermudas.
- Carrinho com tamanho, quantidade, total e persistência em localStorage.
- Mensagem de pedido gerada a partir dos itens do carrinho.
- Login e painel de cadastro, edição e exclusão de produtos.
- Upload de imagens no Firebase Storage e sincronização de produtos no Firestore.

## Tecnologias

React 18, Vite 4, React Router 6, Tailwind CSS, Framer Motion, Firebase Authentication, Firestore e Storage.

## Como executar

Requisitos: Node.js e npm compatíveis com as versões de Vite e dos plugins declaradas em `package.json`.

```sh
git clone https://github.com/Felipegaldinos/araujo-esportes.git
cd araujo-esportes
npm install
```

Antes de iniciar, crie `.env.local` na raiz e preencha com a configuração Web de um projeto Firebase de teste:

```dotenv
VITE_FIREBASE_API_KEY=seu_valor
VITE_FIREBASE_AUTH_DOMAIN=seu_valor
VITE_FIREBASE_PROJECT_ID=seu_valor
VITE_FIREBASE_STORAGE_BUCKET=seu_valor
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_valor
VITE_FIREBASE_APP_ID=seu_valor
```

Habilite Authentication com e-mail/senha e crie o Cloud Firestore. Habilite também o Storage e prepare uma conta de teste no Authentication. Defina as regras de acesso e os domínios autorizados para o ambiente. Essas variáveis são configuração do cliente e não substituem regras de autorização. Não inclua senhas ou credenciais administrativas nelas. Reinicie o Vite depois de alterar o arquivo.

```sh
npm run dev
```

Abra o endereço exibido no terminal.

| Comando | Finalidade |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Gerar a versão de produção |
| `npm run preview` | Visualizar o build localmente |

Na hospedagem, configure o fallback das rotas da aplicação para `index.html`, permitindo acesso direto às páginas internas.

## Organização do código

- `src/contexts/ProductContext.jsx` — catálogo, operações de produtos e upload.
- `src/contexts/CartContext.jsx` — carrinho e mensagem do pedido.
- `src/contexts/AuthContext.jsx` — sessão e login.
- `src/pages/CartPage.jsx` — abertura do WhatsApp.
- `src/lib/firebase.js` — configuração Firebase.

## Roteiro de demonstração

Configure o Firebase de teste, navegue por uma categoria, escolha um tamanho e adicione ao carrinho. Altere a quantidade e recarregue a página. Para testar pedidos, substitua o telefone demonstrativo por um número controlado por você. Teste o painel apenas com produtos de exemplo.

## Limitações atuais

O número de WhatsApp em src/pages/CartPage.jsx é demonstrativo. O pedido abre uma conversa: não há confirmação de pagamento ou processamento de compra no código analisado. /admin exige sessão, mas não verifica função administrativa. Configure autorização nas regras de Firestore e Storage. Ao encontrar a coleção products vazia, a aplicação tenta gravar produtos de exemplo automaticamente; use um projeto Firebase de desenvolvimento.

## Competências demonstradas

Fluxo comercial com Context API, persistência local e integração com serviços externos.

## Autoria

Projeto disponível no perfil de [Felipe Galdino](https://github.com/Felipegaldinos). Consulte os arquivos do repositório para verificar os termos de licença aplicáveis.
