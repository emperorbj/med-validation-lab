# 🏥 RCM Validator

RCM Validator is a healthcare claims validation platform designed to streamline **claims management**, **rules-based validation**, and **analytics reporting**. It provides an intuitive interface for uploading rules and claims, running validations, and reviewing results and performance metrics.

---

## ✨ Features

- **Tenant Management**: Supports multiple hospitals or tenants.  
- **Rules Upload**: Upload **technical** and **medical** rules in PDF or text format.  
- **Claims Upload**: Import claims data (CSV) for validation.  
- **Validation Engine**: Run automated validation against configurable rules.  
- **Analytics Dashboard**: View error distribution, amounts by category, and trends.  
- **Results Viewer**: Inspect validated and error claims with recommended actions.  
- **Responsive UI**: Built with Tailwind CSS and ShadCN components for a modern look.

---

## 🛠️ Tech Stack

### Frontend  
- **React (Vite)** + **TypeScript**  
- **Tailwind CSS** + **ShadCN/UI**  
- **Recharts** for interactive charts  
- **Lucide Icons** for UI visuals  

### Backend  
- **FastAPI** (Python)  
- **MongoDB** for storage  
- **LangChain Google GenAI** for advanced rules processing (optional)

---

## 🚀 Getting Started

### Prerequisites  
- Node.js ≥ 18  
- Python ≥ 3.10  
- MongoDB instance (local or cloud)

### 1️⃣ Clone the Repository
```bash
git clone <your-repo-url>
cd rcm-validator


### 2️⃣ Install Dependencies
#### Frontend
```bash
cd frontend
npm install


```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload