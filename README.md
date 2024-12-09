<h2 align="center"> <img src="https://i.postimg.cc/zGr76Lfj/favicon-3.png" width="22" style="margin-bottom: 0.2;"/> Dango: A Mixed-Initiative Data Wrangling System using Large Language Model</h2>

## 😮 Highlights
Dango is a mixed-initiative system that enables users to generate
data wrangling scripts. Compared to existing tools, Dango enhances user communication of intents by 
(1) 💡 allowing users to demonstrate on multiple tables and use natural language prompts in the conversation interface,
(2) 📝 enabling users to clarify their intents by answering LLM-posed multiple-choice clarification questions,
(3) 🔄 providing multiple forms of feedback such as step-by-step NL explanations and data provenance to help users evaluate and refine the data wrangling scripts.

In a within-subjects, think-aloud study (n=38), the results show that Dango’s features can significantly improve intent specification, accuracy, and efficiency in data wrangling tasks.

## 🛠️ Requirements and Installation

### Frontend

* [Node.js](https://nodejs.org/en/download/) >= v20.17.0

```bash
cd dangle-vite
npm install
```

### Backend

* [Python](https://www.python.org/downloads/) >= v3.10

We suggest using [Conda](https://docs.conda.io/en/latest/miniconda.html) to manage the Python environment.

Create conda environment:
```bash
conda create -n dango python=3.10 -y
conda activate dango
cd dango-backend
pip install -r requirements.txt
```

### Set OpenAI API
```bash
export OPENAI_API_KEY=<YOUR_API_KEY>
```

## 🚀 Quickstart

### Frontend
```bash
cd dangle-vite
npm run dev
```

### Backend
```bash
cd dango-backend
uvicorn back_end:app
```

Dango is now running on `http://localhost:5173/`, enjoy!