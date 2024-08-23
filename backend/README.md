## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Setup](#backend-setup)
2. [Install Dependencies](#install-dependencies)
4. [Running the Application](#running-the-application)


## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Python 3.x**: Required for the Flask backend.


You can check if you have these installed by running:

```bash
python --version
```
## Backend Setup

- On Windows:

```bash
py -3 -m venv venv
venv\Scripts\activate
```

- On macOS/Linux:

```bash
python -m venv venv
source venv/bin/activate
```


## Install Dependencies

If you haven't installed flask-cors yet, you need to add it to your Flask application. If sudo isn’t available, you can use the virtual environment:

```bash
pip install flask-cors
```


## Running the Application

```bash
python app.py
```
