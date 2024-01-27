<span id="topo"></span>

# Protótipo Sistema de Advocacia (Front End)

## 🚀 Tecnologias

-   [Next](https://nextjs.org/)
-   [React icons](https://react-icons.github.io/react-icons/)
-   [TypeScript](https://www.typescriptlang.org/)

---

## 🚩 Início do desenvolvimento

No seu terminal, com o git instalado, use o seguinte comando:

```bash
git clone https://github.com/devteam-tecno/requiao_front.git
```

Depois, faça as a instalação dos arquivos necessários para rodar o projeto.

```bash
npm install
```

---

## 📁 Estrutura de arquivos padrão

```
public
├── assets
│   └── // Arquivos de imagem, ícones, etc.
src
├── App
│   ├── // Página Inicial.
│   └── favcon.ico
│   └── globals.css
│   └── layout.tsx
│   └── page.tsx
│   └── page.module.css
│   └── // Estrutura de páginas.
│   └── (Public)
│   │   ├── Pagina1
│   │   │   ├── page.tsx
│   │   │   └── page.module.css
│   └── (Private)
│   │   ├── Pagina1
│   │   │   ├── page.tsx
│   │   │   └── page.module.css
├── components
│   ├── Header
│   │   ├── index.jsx
│   │   └── styles.js
│   ├── Componente1
│   │   ├── index.jsx
│   │   └── styles.js
│   └── Componente2
│       ├── index.jsx
│       └── styles.js
```

---

## 📄 Páginas

As páginas são componentes que são utilizados para renderizar conteúdo na tela, como por exemplo, uma página de login, uma página de cadastro, uma página de perfil, etc. Para criar uma página, basta criar uma pasta, e à depender do objetivo, deve utilizar a estrutura mais apropriada. usando page.tsx e layout.tsx, ou apenas page.tsx.

Para mais informações, acesse o conteudo sobre [Pages and Layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts) do Nextjs.

---

## ⭐ Ícones

Para utilizar ícones na aplicação, basta instalar o [React icons](https://react-icons.github.io/react-icons/) e utilizar os ícones que você precisa.

```bash
npm install react-icons --save
```

Após a instalação, basta acessar o site e escolher o icone, copiando o nome.

### ⭐ Exemplo

```tsx
// src/components/Componete1/index.tsx

import React from "react"
import { IconName } from "react-icons/ai"

export default function Componente1() {
	return (
		<div>
			<IconName />
		</div>
	)
}
```

---

## ℹ️ README dos projetos

Cada projeto deve ter um README.md com as informações necessárias para que qualquer pessoa possa entender o que o projeto faz e como rodá-lo. O README deve seguir o [Guia de README](https://github.com/devteam-tecno/.github-private/blob/main/guia/Readme.md)

## 👤 Autor

-   [**João Pedro**](https://github.com/oJorta)

[⬆️ Voltar ao topo](#topo)
