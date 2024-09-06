# Use an official Python runtime as the base image
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /app

# Create the necessary directory for EasyOCR
RUN mkdir -p /root/.EasyOCR

RUN pip install --no-cache-dir easyocr && \
    python -c "import easyocr; reader = easyocr.Reader(['en']);"


# Copy the requirements file to the container
COPY ./requirements.txt .

expose 5000

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code to the container
COPY . .

# Set the command to run the application
CMD ["python", "app.py"]

