# NER-RAG Frontend

## Overview

This is the frontend application for the S2T system, built using **Next.js**. It is designed to provide an interactive visualization of entities and relationships extracted by the backend. The application features an NER (Named Entity Recognition) graph and a RAG (Retrieval-Augmented Generation) question-and-answer interface.

Key features include:

- **NER Graph**: Visual representation of entities and relationships using the React Force Graph library.
- **RAG Q&A Interface**: Query interface for the RAG system to retrieve context-enriched answers.
- **Modern UI Design**: Built with ShadCN components and styled using Tailwind CSS.

---

## Features

- **Interactive Graphs**:

  - Visualize entities (e.g., Persons, Events, Locations, Vehicles) and their relationships.
  - Use the React Force Graph library for dynamic graph rendering.

- **RAG Q&A Interface**:

  - Query and display results from the backend RAG system.
  - Contextual reasoning steps and source documents are included.

- **Styling and Components**:

  - UI components designed with ShadCN for a cohesive look.
  - Styled using Tailwind CSS for responsive and modern design.

---

## Directory Structure

```
.
├── README.md
├── app
│   ├── favicon.ico
│   ├── fonts
│   │   ├── GeistMonoVF.woff
│   │   └── GeistVF.woff
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── rag-qa
│   │   └── page.tsx
│   └── styles
│       └── colors.ts
├── components
│   ├── GraphList.tsx
│   ├── InfoPanel.tsx
│   ├── Legend.tsx
│   ├── LinkInfoPanel.tsx
│   ├── Loader.tsx
│   ├── RelationshipTypeSelector.tsx
│   ├── TextInputModal.tsx
│   └── ui
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── checkbox.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── scroll-area.tsx
│       ├── select.tsx
│       └── textarea.tsx
├── components.json
├── lib
│   └── utils.ts
├── loading-icon.json
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## Installation and Setup

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/trishulam/S2T-Frontend.git
   cd S2T-Frontend
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Run the Development Server**:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

4. **Build the Application** (for production):

   ```bash
   npm run build
   ```

5. **Start the Production Server**:

   ```bash
   npm run start
   ```

---

## Features in Detail

### NER Graph

- **Nodes and Relationships**:

  - Nodes represent entities such as Persons, Locations, Events, Emails, and Phones.
  - Relationships include Person-to-Person, Person-to-Vehicle, Location-to-Event, etc.

- **Legend**:

  - A legend is provided to distinguish between different types of nodes and relationships.

- **Interactions**:

  - Zoom, pan, and select nodes/edges for detailed information.
 
![Screenshot 2024-12-12 at 12 29 27 AM](https://github.com/user-attachments/assets/d06095ea-b4b7-4c6b-86a1-437806254d27)

### RAG Q&A Interface

- Allows users to ask questions about extracted entities and relationships.
- Provides answers enriched with contextual reasoning steps and source documents.
- Dropdown to select the model provider (e.g., OpenAI).

![Screenshot 2024-12-12 at 12 36 14 AM](https://github.com/user-attachments/assets/eeb3caa3-076c-4fd5-a005-0ce636b1d144)

---

## Technologies Used

- **Framework**: Next.js
- **Visualization**: React Force Graph
- **Styling**: ShadCN components and Tailwind CSS
