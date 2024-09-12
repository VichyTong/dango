# dango-backend

## Create a virtual environment
```
python3 -m venv venv
```

## Activate the virtual environment
```
source venv/bin/activate
```

## Install dependencies
```
pip install -r requirements.txt
```

## Set the openai api key
```
export OPENAI_API_KEY=your-api-key
```

## Install SQLite
```
# Update the package list
sudo apt update

# Install SQLite
sudo apt install sqlite3

# Check the installation
sqlite3 --version
```

## Run the server
```
uvicorn back_end:app --reload
```